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

// const express = require("express");
// const sqlite3 = require("sqlite3").verbose();
// const bodyParser = require("body-parser");
// const cors = require("cors");

// const saveToGoogleSheets =
// require("./googleSheets");

// const app = express();

// app.use(cors());
// app.use(bodyParser.json());
// app.use(express.static("public"));

// const db =
// new sqlite3.Database("./database/students.db");

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
//                     message:
//                     "Register Number Not Found"
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
// app.post("/submit", async (req, res) => {

//     const {
//         regNo,
//         priority1,
//         priority2
//     } = req.body;

//     if (priority1 === priority2) {

//         return res.json({
//             success: false,
//             message:
//             "Priorities cannot be same"
//         });
//     }

//     db.get(
//         "SELECT * FROM students WHERE regNo = ?",
//         [regNo],

//         async (err, row) => {

//             if (err) {

//                 return res.json({
//                     success: false,
//                     message: "Database Error"
//                 });
//             }

//             if (!row) {

//                 return res.json({
//                     success: false,
//                     message: "Student not found"
//                 });
//             }

//             if (row.submitted === 1) {

//                 return res.json({
//                     success: false,
//                     message:
//                     "Already submitted"
//                 });
//             }

//             db.run(
//                 `UPDATE students
//                  SET submitted = 1,
//                  priority1 = ?,
//                  priority2 = ?
//                  WHERE regNo = ?`,

//                 [
//                     priority1,
//                     priority2,
//                     regNo
//                 ],

//                 async function(err) {

//                     if (err) {

//                         return res.json({
//                             success: false,
//                             message:
//                             "Submission failed"
//                         });
//                     }

//                     try {

//                         const studentData = {

//                             regNo: row.regNo,

//                             name: row.name,

//                             section: row.section,

//                             priority1,

//                             priority2
//                         };

//                         console.log(studentData);

//                         await saveToGoogleSheets(
//                             studentData
//                         );

//                         console.log(
//                             "Google Sheets Updated"
//                         );

//                         return res.json({
//                             success: true,
//                             message:
//                             "Submitted Successfully"
//                         });

//                     } catch(error) {

//                         console.log(error);

//                         return res.json({
//                             success: false,
//                             message:
//                             "Google Sheets Error"
//                         });
//                     }
//                 }
//             );
//         }
//     );
// });

// // app.listen(3000, () => {

// //     console.log(
// //         "Server running on port 3000"
// //     );
// // });

// const PORT =
// process.env.PORT || 3000;

// app.listen(PORT, () => {

//     console.log(
//         `Server running on port ${PORT}`
//     );
// });




const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");


if (!fs.existsSync("uploads")) {

    fs.mkdirSync("uploads");

}

const uploadPayment =
require("./googleDrivePayment");

const uploadConsent =
require("./googleDrive");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(
"/uploads",
express.static("uploads")
);

const db =
new sqlite3.Database(
"./database/students.db"
);


/* =========================
STUDENT TABLE
========================= */

db.run(`

CREATE TABLE IF NOT EXISTS students (


regNo TEXT PRIMARY KEY,

name TEXT,

section TEXT


)

`);

/* =========================
FILE UPLOAD
========================= */

const storage =
multer.diskStorage({


destination:
function(req,file,cb){

    cb(
        null,
        "uploads"
    );
},

filename:
function(req,file,cb){

    cb(
        null,
        Date.now()
        + "_"
        + file.originalname
    );
}


});

const upload =
multer({
storage
});

/* =========================
HOME
========================= */

app.get("/",(req,res)=>{


res.send(
    "Server Running"
);


});

/* =========================
LOGIN
========================= */

app.post(
"/login",

(req,res)=>{


const {
    regNo,
    section
} = req.body;

db.get(

    `
    SELECT *
    FROM students
    WHERE regNo = ?
    AND section = ?
    `,

    [
        regNo,
        section
    ],

    (err,row)=>{

        if(err){

            return res.json({

                success:false,

                message:
                "Database Error"
            });
        }

        if(!row){

            return res.json({

                success:false,

                message:
                "Register Number Not Found"
            });
        }

        return res.json({

            success:true,

            student:row
        });
    }
);


});

/* =========================
CONSENT UPLOAD
========================= */


/* =========================
SERVER
========================= */

app.post(
"/upload-consent",
upload.single("file"),

async (req,res)=>{

    try{

        const {
            regNo,
            section
        } = req.body;

        if(!req.file){

            return res.json({

                success:false,

                message:
                "No file uploaded"
            });
        }

        if(req.file.size > 5 * 1024 * 1024){

    fs.unlinkSync(
        req.file.path
    );

    return res.json({

        success:false,

        message:
        "Image size must be less than 5 MB"

    });
}


        const fileId =
        await uploadConsent(

            req.file.path,

            regNo,

            section,

            req.file.mimetype
        );

        fs.unlinkSync(
            req.file.path
        );

        return res.json({

            success:true,

            fileId
        });

    }

catch(error){

    console.log(error);

    return res.json({

        success:false,

        message:error.message
    });
}
});


const PORT =
process.env.PORT || 3000;

app.listen(PORT,()=>{


console.log(
    `Server running on port ${PORT}`
);


});

app.get("/drive-test", async (req,res)=>{

    try{

        const { google } = require("googleapis");

        const auth =
        new google.auth.GoogleAuth({

            keyFile:"credentials.json",

            scopes:[
                "https://www.googleapis.com/auth/drive"
            ]
        });

        const drive =
        google.drive({

            version:"v3",

            auth
        });

        const result =
        await drive.files.list({

            pageSize:10,

            fields:"files(id,name)"
        });

        res.json(result.data);

    }

    catch(err){

        console.log(err);

        res.json(err.message);
    }
});

app.post(
"/upload-payment",
upload.single("file"),

async (req,res)=>{

    try{

        const {
            regNo,
            section
        } = req.body;

        if(!req.file){

            return res.json({

                success:false,

                message:
                "No file uploaded"
            });
        }

        if(req.file.size > 5 * 1024 * 1024){

            fs.unlinkSync(
                req.file.path
            );

            return res.json({

                success:false,

                message:
                "Image size must be less than 5 MB"
            });
        }



        const fileData =
        await uploadPayment(

            req.file.path,

            regNo,

            section,

            req.file.mimetype
        );

        fs.unlinkSync(
            req.file.path
        );

        return res.json({

            success:true,

            file:fileData
        });

    }

catch(error){

    console.log(error);

    if(
        req.file &&
        fs.existsSync(req.file.path)
    ){

        fs.unlinkSync(
            req.file.path
        );
    }

    return res.json({

        success:false,

        message:error.message
    });
}
});