const fs = require("fs");
const { google } = require("googleapis");

const config = {

    client_id:
    process.env.CLIENT_ID,

    client_secret:
    process.env.CLIENT_SECRET,

    refresh_token:
    process.env.REFRESH_TOKEN

};

const oAuth2Client =
new google.auth.OAuth2(

    config.client_id,

    config.client_secret,

    "http://localhost"
);

oAuth2Client.setCredentials({

    refresh_token:
    config.refresh_token
});

const drive =
google.drive({

    version:"v3",

    auth:oAuth2Client
});

const folderMap = {

    "DS-AA": "1cAZ2-0S6VzSQQI7n9RYCt6SB4OUZlA_f",
    "DS-AB": "1fqY_ZTlx1yVCOMnMCdQV-0E-it05DhJ_",
    "DS-BA": "1JMG640-JWU66t1ntBtM6X1ph0BCfZnAD",
    "DS-BB": "1amBkwenLTJe9pQqDPv09Ve9EIRaor9Ug",

    "DSAI-AA": "1NMvcnOMg93JoAlYd9guRNYKkL5OLsy0_",
    "DSAI-AB": "1HK_PSsziSeEffGLC1Dpxkl0kjkvp7fib",
    "DSAI-BA": "1zhORXnGdaun5QmtWeQrds6wGiYYt-GZH",
    "DSAI-BB": "1Iv2kr9B9Apv3yoht4_eLn0PmA1kB1To0"

};

async function uploadConsent(

    filePath,

    regNo,

    section,

    mimeType

){

    const folderId =
    folderMap[section];

    if(!folderId){

        throw new Error(
            "Invalid Section"
        );
    }

    const extension =

    mimeType === "image/png"

    ? ".png"

    : ".jpg";

    const response =
    await drive.files.create({

        requestBody:{

            name:
            regNo + extension,

            parents:[
                folderId
            ]
        },

        media:{

            mimeType,

            body:
            fs.createReadStream(
                filePath
            )
        },

        fields:"id,name"
    });

    return response.data;
}

module.exports =
uploadConsent;