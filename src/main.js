console.clear();

const Client = require("./structures/Client.js");
const client = new Client();
require("dotenv").config({ path: "src/resources/data/.env" });

client.start(process.env.TOKEN);
