// const express = require("express");
// const sqlite3 = require("sqlite3").verbose();
// const bodyParser = require("body-parser");
// const cors = require("cors");

// const app = express();

// app.use(cors());
// app.use(bodyParser.json());
// app.use(express.static("public"));

// const db = new sqlite3.Database("./database/students.db");

// // Create Students Table
// db.run(`
// CREATE TABLE IF NOT EXISTS students (
//     regNo TEXT PRIMARY KEY,
//     name TEXT,
//     section TEXT,
//     submitted INTEGER DEFAULT 0,
//     priority1 TEXT,
//     priority2 TEXT
// )
// `);

// app.get("/", (req, res) => {
//     res.send("Server is running");
// });

// // LOGIN API
// app.post("/login", (req, res) => {

//     const { regNo, section } = req.body;

//     db.get(
//         "SELECT * FROM students WHERE regNo = ? AND section = ?",
//         [regNo, section],
//         (err, row) => {

//             if (err) {
//                 return res.json({
//                     success: false,
//                     message: "Database Error"
//                 });
//             }

//             if (!row) {
//                 return res.json({
//                     success: false,
//                     message: "Register Number Not Found"
//                 });
//             }

//             return res.json({
//                 success: true,
//                 student: row
//             });
//         }
//     );
// });

// // SUBMIT API
// app.post("/submit", (req, res) => {

//     const { regNo, priority1, priority2 } = req.body;

//     if (priority1 === priority2) {
//         return res.json({
//             success: false,
//             message: "Priorities cannot be same"
//         });
//     }

//     db.get(
//         "SELECT * FROM students WHERE regNo = ?",
//         [regNo],
//         (err, row) => {

//             if (!row) {
//                 return res.json({
//                     success: false,
//                     message: "Student not found"
//                 });
//             }

//             if (row.submitted === 1) {
//                 return res.json({
//                     success: false,
//                     message: "Already submitted"
//                 });
//             }

//             db.run(
//                 `UPDATE students
//                  SET submitted = 1,
//                  priority1 = ?,
//                  priority2 = ?
//                  WHERE regNo = ?`,
//                 [priority1, priority2, regNo],
//                 function(err) {

//                     if (err) {
//                         return res.json({
//                             success: false,
//                             message: "Submission failed"
//                         });
//                     }

//                     return res.json({
//                         success: true,
//                         message: "Submitted Successfully"
//                     });
//                 }
//             );
//         }
//     );
// });

// app.listen(3000, () => {
//     console.log("Server running on port 3000");
// });

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const saveToGoogleSheets =
require("./googleSheets");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const db =
new sqlite3.Database("./database/students.db");

// Create Students Table
db.run(`
CREATE TABLE IF NOT EXISTS students (
    regNo TEXT PRIMARY KEY,
    name TEXT,
    section TEXT,
    submitted INTEGER DEFAULT 0,
    priority1 TEXT,
    priority2 TEXT
)
`);

app.get("/", (req, res) => {
    res.send("Server is running");
});

// LOGIN API
app.post("/login", (req, res) => {

    const { regNo, section } = req.body;

    db.get(
        "SELECT * FROM students WHERE regNo = ? AND section = ?",
        [regNo, section],
        (err, row) => {

            if (err) {

                return res.json({
                    success: false,
                    message: "Database Error"
                });
            }

            if (!row) {

                return res.json({
                    success: false,
                    message:
                    "Register Number Not Found"
                });
            }

            return res.json({
                success: true,
                student: row
            });
        }
    );
});

// SUBMIT API
app.post("/submit", async (req, res) => {

    const {
        regNo,
        priority1,
        priority2
    } = req.body;

    if (priority1 === priority2) {

        return res.json({
            success: false,
            message:
            "Priorities cannot be same"
        });
    }

    db.get(
        "SELECT * FROM students WHERE regNo = ?",
        [regNo],

        async (err, row) => {

            if (err) {

                return res.json({
                    success: false,
                    message: "Database Error"
                });
            }

            if (!row) {

                return res.json({
                    success: false,
                    message: "Student not found"
                });
            }

            if (row.submitted === 1) {

                return res.json({
                    success: false,
                    message:
                    "Already submitted"
                });
            }

            db.run(
                `UPDATE students
                 SET submitted = 1,
                 priority1 = ?,
                 priority2 = ?
                 WHERE regNo = ?`,

                [
                    priority1,
                    priority2,
                    regNo
                ],

                async function(err) {

                    if (err) {

                        return res.json({
                            success: false,
                            message:
                            "Submission failed"
                        });
                    }

                    try {

                        const studentData = {

                            regNo: row.regNo,

                            name: row.name,

                            section: row.section,

                            priority1,

                            priority2
                        };

                        console.log(studentData);

                        await saveToGoogleSheets(
                            studentData
                        );

                        console.log(
                            "Google Sheets Updated"
                        );

                        return res.json({
                            success: true,
                            message:
                            "Submitted Successfully"
                        });

                    } catch(error) {

                        console.log(error);

                        return res.json({
                            success: false,
                            message:
                            "Google Sheets Error"
                        });
                    }
                }
            );
        }
    );
});

// app.listen(3000, () => {

//     console.log(
//         "Server running on port 3000"
//     );
// });

const PORT =
process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );
});