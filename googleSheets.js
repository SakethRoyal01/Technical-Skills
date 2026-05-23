const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: [
        "https://www.googleapis.com/auth/spreadsheets"
    ]
});

const sheets =
    google.sheets({
        version: "v4",
        auth
    });

const SPREADSHEET_ID =
    "1kEX5dnux3nzOlBO2t4crDiNRSba8VaWrT_bsjSPgjV8";

async function saveToGoogleSheets(data) {

    const {
        regNo,
        name,
        section,
        priority1,
        priority2
    } = data;

    const currentTime =
        new Date().toLocaleString();

    await sheets.spreadsheets.values.append({

        spreadsheetId:
            SPREADSHEET_ID,

        range:
            `${section}!A:F`,

        valueInputOption:
            "USER_ENTERED",

        requestBody: {

            values: [[
                regNo,
                name,
                section,
                priority1,
                priority2,
                currentTime
            ]]
        }
    });
}

module.exports =
    saveToGoogleSheets;