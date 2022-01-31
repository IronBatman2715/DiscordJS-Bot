const Client = require("../../structures/Client.js");

module.exports =
  /**
   * @param {Client} client
   */
  async (client) => {
    console.log(`Disconnected from MongoDB!`);
  };
