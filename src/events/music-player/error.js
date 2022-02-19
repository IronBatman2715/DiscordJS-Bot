const { Queue } = require("discord-music-player");

const Client = require("../../structures/Client");

/**
 * @param {Client} client
 * @param {string} error
 * @param {Queue} queue
 */
module.exports = (client, error, queue) => {
  console.error(`Error: ${error} in ${queue.guild.name}!`);
};
