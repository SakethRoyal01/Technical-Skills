const fs = require("fs");
const { google } = require("googleapis");

const config =
require("./driveConfig");

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

    "DS-AA": "1f2nR0pJDSfwcyUaEF9EKqxreNxvEzSfH",
    "DS-AB": "1oO6DuU2HqSBSpGXc8vAjgAcMM930FroW",
    "DS-BA": "1EEIDG9z-IAgDJJpscdnCVHPI7XSwN1-q",
    "DS-BB": "1CtWFMvJHEChmMYX9dHPHq-LqqKDs9Tr_",

    "DSAI-AA": "13Fhn5zcBMk6qc5R8ps4YVYUdNpLqI5tE",
    "DSAI-AB": "16txpelK_Mx1jv6sZ7tIXJ3MDg3M1XyMy",
    "DSAI-BA": "1Hm7MEt9P8xa62MoexXTHfFw3GnYO1xw9",
    "DSAI-BB": "1rMwoBFeZvv--XrLLomKlXwTHwrDOBh1y"

};

async function fileExists(

    regNo,

    folderId

){

    const result =
    await drive.files.list({

        q:
        `'${folderId}' in parents and trashed = false`,

        fields:
        "files(id,name)"
    });

    return result.data.files.some(

        file =>

        file.name === regNo + ".jpg" ||

        file.name === regNo + ".png"
    );
}

async function uploadPayment(


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

    const alreadyExists =
await fileExists(

    regNo,

    folderId
);

if(alreadyExists){

    throw new Error(

        "Payment proof already submitted"
    );
}

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
uploadPayment;