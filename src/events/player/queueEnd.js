const { Queue } = require("discord-music-player");
const Client = require("../../structures/Client.js");

module.exports =
  /**
   * @param {Client} client
   * @param {Queue} queue
   */
  async (client, queue) => {
    console.log("DMP.PlayerEvents:queueEnd => Queue ended!");

    await queue.data.deleteEmbedMessage();
  };
