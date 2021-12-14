const Client = require("../structures/Client.js");
const PlayerEvent = require("../structures/PlayerEvent.js");
const { Queue, Song } = require("discord-music-player");

module.exports = new PlayerEvent(
  /**
   * @param {Client} client
   * @param {Queue} queue
   * @param {Song} song
   */
  async (client, queue, song) => {
    console.log(
      `${song.requestedBy.username} added this song to the queue:\n\t${song.name}`
    );
  }
);
