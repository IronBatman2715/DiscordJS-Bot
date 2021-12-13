const Event = require("../structures/Event.js");

module.exports = new Event("error", (client, error) => {
  console.log(`Error: ${error}!`);
});
