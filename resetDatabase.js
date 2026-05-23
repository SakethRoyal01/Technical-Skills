const sqlite3 =
require("sqlite3").verbose();

const db =
new sqlite3.Database(
    "./database/students.db"
);

db.run(
    `
    UPDATE students
    SET
        submitted = 0,
        priority1 = NULL,
        priority2 = NULL
    `,
    function(err) {

        if (err) {

            console.log(err.message);

        } else {

            console.log(
                "Database Reset Successful"
            );
        }

        db.close();
    }
);