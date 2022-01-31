const { Queue } = require("discord-music-player");
const Client = require("../../structures/Client");

module.exports =
  /**
   * @param {Client} client
   * @param {Queue} queue
   */
  async (client, queue) => {
    console.log("DMP.PlayerEvents:queueDestroyed => Queue destroyed!");

    await queue.data.deleteEmbedMessage();
  };
