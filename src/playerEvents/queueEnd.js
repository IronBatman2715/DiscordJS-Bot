const Client = require("../structures/Client.js");
const PlayerEvent = require("../structures/PlayerEvent.js");
const { Queue } = require("discord-music-player");

module.exports = new PlayerEvent(
  /**
   * @param {Client} client
   * @param {Queue} queue
   */
  async (client, queue) => {
    console.log("DMP.PlayerEvents:queueEnd => Queue ended!");

    await queue.data.deleteEmbedMessage();
  }
);
