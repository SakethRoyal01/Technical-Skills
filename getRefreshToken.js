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
"4/0AeoWuM_ahbXnVo0F44XjmU5QiTsUNXysc6HouANWnOzJIfBZFgh5oal2laUG-fvyV9cjEQ";

async function main() {

    const { tokens } =
    await oAuth2Client.getToken(code);

    console.log(tokens);

}

main().catch(console.error);