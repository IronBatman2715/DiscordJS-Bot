const { Queue } = require("discord-music-player");
const Client = require("../../structures/Client");

module.exports =
  /**
   * @param {Client} client
   * @param {string} error
   * @param {Queue} queue
   */
  (client, error, queue) => {
    console.error(`Error: ${error} in ${queue.guild.name}!`);
  };
