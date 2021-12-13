const Client = require("../structures/Client.js");
const PlayerEvent = require("../structures/PlayerEvent.js");
const DMP = require("discord-music-player");

module.exports = new PlayerEvent(
  "songAdd",
  /**
   * @param {Client} client
   * @param {DMP.Queue} queue
   * @param {DMP.Song} song
   */
  async (client, queue, song) => {
    console.log(
      `${song.requestedBy.username} added this song to the queue:\n\t${song.name}`
    );
  }
);
