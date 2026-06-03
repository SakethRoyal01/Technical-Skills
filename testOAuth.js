// testOAuth.js

const fs = require("fs");
const { google } = require("googleapis");

const credentials =
JSON.parse(fs.readFileSync("oauth.json"));

const config = credentials.installed;

const oauth2Client =
new google.auth.OAuth2(
    config.client_id,
    config.client_secret,
    "http://localhost"
);

const url =
oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
        "https://www.googleapis.com/auth/drive"
    ]
});

console.log(url);

