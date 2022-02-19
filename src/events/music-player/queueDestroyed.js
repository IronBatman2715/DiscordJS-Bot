const { Queue } = require("discord-music-player");

const Client = require("../../structures/Client");

/**
 * @param {Client} client
 * @param {Queue} queue
 */
module.exports = async (client, queue) => {
  console.log("DMP.PlayerEvents:queueDestroyed => Queue destroyed!");

  await queue.data.deleteEmbedMessage();
};
