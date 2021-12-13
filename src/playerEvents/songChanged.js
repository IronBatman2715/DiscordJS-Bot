const Client = require("../structures/Client.js");
const PlayerEvent = require("../structures/PlayerEvent.js");
const DMP = require("discord-music-player");

module.exports = new PlayerEvent(
  "songChanged",
  /**
   * @param {Client} client
   * @param {DMP.Queue} queue
   * @param {DMP.Song} newSong
   * @param {DMP.Song} oldSong
   */
  async (client, queue, newSong, oldSong) => {
    if (oldSong == newSong) {
      console.log(`Repeated song:\n\t${oldSong.name}`);
    } else {
      console.log(
        `Song changed from\n\t${oldSong.name}\n\t\tto\n\t${newSong.name}`
      );
    }

    queue.data.updateNowPlaying(client, newSong);
  }
);
