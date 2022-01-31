console.clear();

const Client = require("./structures/Client");
const client = new Client(true);
require("dotenv").config();

client.start();
