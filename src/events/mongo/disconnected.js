const Client = require("../../structures/Client");

module.exports =
  /**
   * @param {Client} client
   */
  async (client) => {
    console.log(`Disconnected from MongoDB!`);
  };
