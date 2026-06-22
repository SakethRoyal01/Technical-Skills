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

const code =
"4/0AdkVLPyvcWs3SFXGU4KeAr1mbpzLqP1EBRJL52ilw5iX8osKuu9HYbDU_8_JHr-ZRTEaTQ";

async function main() {

    const { tokens } =
    await oAuth2Client.getToken(code);

    console.log(tokens);

}

main().catch(console.error);