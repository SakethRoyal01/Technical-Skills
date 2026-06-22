const { google } = require("googleapis");

let auth;

if (process.env.GOOGLE_CREDENTIALS) {

    auth = new google.auth.GoogleAuth({

        credentials: JSON.parse(
            process.env.GOOGLE_CREDENTIALS
        ),

        scopes: [
            "https://www.googleapis.com/auth/spreadsheets"
        ]
    });

} else {

    auth = new google.auth.GoogleAuth({

        keyFile: "credentials.json",

        scopes: [
            "https://www.googleapis.com/auth/spreadsheets"
        ]
    });
}

const sheets = google.sheets({

    version: "v4",

    auth
});

const FEEDBACK_SHEET_ID =
"1NHVD62ixWnx1fT7Pk6X2TOjW4TzSqLlQapvHGrruWgk";

async function saveFeedback(data){

    const {
        regNo,
        name,
        section,
        courseBatch,
        qualityRating,
        contentRelevance,
        knowledgeImprovement,
        usefulTopic,
        suggestions,
        trainerFeedback,
        overallRating
    } = data;

    const timestamp =
    new Date().toLocaleString();

    const existingData =
await sheets.spreadsheets.values.get({

    spreadsheetId:
    FEEDBACK_SHEET_ID,

    range:
    `${section}!A:A`
});

const regNos =
existingData.data.values || [];

const alreadySubmitted =
regNos.some(
    row => row[0] === regNo
);

if(alreadySubmitted){

    throw new Error(
        "Feedback already submitted"
    );
}

    await sheets.spreadsheets.values.append({

        spreadsheetId:
        FEEDBACK_SHEET_ID,

        range:
        `${section}!A:K`,

        valueInputOption:
        "USER_ENTERED",

        requestBody:{

            values:[[
                regNo,
                name,
                courseBatch,
                qualityRating,
                contentRelevance,
                knowledgeImprovement,
                usefulTopic,
                suggestions,
                trainerFeedback,
                overallRating,
                timestamp
            ]]
        }
    });
}

module.exports =
saveFeedback;