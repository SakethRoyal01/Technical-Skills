const fs = require("fs");
const { google } = require("googleapis");

// Read OAuth credentials
const credentials = JSON.parse(
    fs.readFileSync("oauth.json")
);

const config = credentials.installed;

// Create OAuth client
const oAuth2Client = new google.auth.OAuth2(
    config.client_id,
    config.client_secret,
    config.redirect_uris[0]
);

// Generate authorization URL
const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
        "https://www.googleapis.com/auth/drive"
    ]
});

console.log("\n=================================\n");
console.log("OPEN THIS URL IN CHROME:\n");
console.log(authUrl);
console.log("\n=================================\n");

// Save URL to file
fs.writeFileSync("authUrl.txt", authUrl);

console.log("URL saved to authUrl.txt");