const Event = require("../structures/Event");

module.exports = new Event((client, error) => {
  console.log(`Error: ${error}!`);
});
