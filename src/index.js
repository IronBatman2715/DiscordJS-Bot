console.clear();

require("dotenv").config();
const Client = require("./structures/Client");
const client = new Client(false);

client.start();
