console.clear();

const Client = require("./structures/Client.js");
const client = new Client(true);
require("dotenv").config();

client.start();
