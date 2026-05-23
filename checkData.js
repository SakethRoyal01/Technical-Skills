const sqlite3 = require("sqlite3").verbose();

const db =
    new sqlite3.Database(
        "./database/students.db"
    );

db.all(
    `
    SELECT
        section,
        COUNT(*) as total
    FROM students
    GROUP BY section
    `,
    [],
    (err, rows) => {

        if (err) {
            console.log(err.message);
            return;
        }

        console.log("\nImported Students:\n");

        rows.forEach((row) => {

            console.log(
                `${row.section} : ${row.total}`
            );
        });

        db.close();
    }
);