const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/students.db");

db.run(
    `INSERT INTO students 
    (regNo, name, section, submitted)
    VALUES (?, ?, ?, ?)`,
    ["241641101001", "D.ABINAYA", "DS-AA", 0],
    function(err) {

        if (err) {
            console.log(err.message);
        } else {
            console.log("Student inserted successfully");
        }

        db.close();
    }
);