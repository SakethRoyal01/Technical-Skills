const fs = require("fs");
const { google } = require("googleapis");

const credentials =
JSON.parse(fs.readFileSync("oauth.json"));

const config = credentials.installed;

const oAuth2Client =
new google.auth.OAuth2(
    config.client_id,
    config.client_secret,
    config.redirect_uris[0]
);

const url =
oAuth2Client.generateAuthUrl({

    access_type: "offline",

    prompt: "consent",

    scope: [
        "https://www.googleapis.com/auth/drive"
    ]
});

console.log(url);


// https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive&response_type=code&client_id=53096290945-sq5v9dv9uv1r9skmbi3ac45f19qbqid4.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost