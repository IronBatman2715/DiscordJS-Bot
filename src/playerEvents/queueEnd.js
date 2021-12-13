const Client = require("../structures/Client.js");
const PlayerEvent = require("../structures/PlayerEvent.js");
const DMP = require("discord-music-player");

module.exports = new PlayerEvent(
  "queueEnd",
  /**
   * @param {Client} client
   * @param {DMP.Queue} queue
   */
  async (client, queue) => {
    console.log("DMP.PlayerEvents:queueEnd => Queue ended!");

    await queue.data.deleteEmbedMessage();
  }
);
