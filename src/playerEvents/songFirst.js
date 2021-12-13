const Client = require("../structures/Client.js");
const PlayerEvent = require("../structures/PlayerEvent.js");
const DMP = require("discord-music-player");

module.exports = new PlayerEvent(
  "songFirst",
  /**
   * @param {Client} client
   * @param {DMP.Queue} queue
   * @param {DMP.Song} song
   */
  async (client, queue, song) => {
    console.log(`Playing first song in new queue:\n\t${song.name}`);

    queue.data.updateNowPlaying(client, song);
  }
);
