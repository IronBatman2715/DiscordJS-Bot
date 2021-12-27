console.clear();

const Client = require("./structures/Client.js");
require("dotenv").config({ path: "src/resources/data/.env" });
const client = new Client();

client.start(process.env.TOKEN);
