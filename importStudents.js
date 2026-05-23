const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/students.db");

const csvFolder = "./csv-files";

const files = fs.readdirSync(csvFolder);

files.forEach((file) => {

    const section =
        path.basename(file, ".csv");

    const filePath =
        path.join(csvFolder, file);

    fs.createReadStream(filePath)

        .pipe(csv({
            headers: false
        }))

        .on("data", (row) => {

            const values =
                Object.values(row);

            let regNo = "";
            let name = "";

            // Find 12 digit register number
            for (let value of values) {

                if (!value) continue;

                value = value.trim();

                if (/^\d{12}$/.test(value)) {
                    regNo = value;
                }
            }

            // Find name after register number
            const regIndex =
                values.findIndex(v =>
                    v && /^\d{12}$/.test(v.trim())
                );

            if (
                regIndex !== -1 &&
                values[regIndex + 1]
            ) {
                name =
                    values[regIndex + 1].trim();
            }

            // Skip invalid rows
            if (!regNo || !name) {
                return;
            }

            db.run(
                `INSERT OR IGNORE INTO students
                (regNo, name, section, submitted)
                VALUES (?, ?, ?, ?)`,
                [
                    regNo,
                    name,
                    section,
                    0
                ],
                (err) => {

                    if (err) {
                        console.log(err.message);
                    }
                }
            );

            console.log(
                `Inserted: ${regNo} - ${name} - ${section}`
            );
        })

        .on("end", () => {

            console.log(
                `${file} imported successfully`
            );
        });
});