const { Queue, Song } = require("discord-music-player");
const Client = require("../../structures/Client.js");

module.exports =
  /**
   * @param {Client} client
   * @param {Queue} queue
   * @param {Song} song
   */
  async (client, queue, song) => {
    console.log(`Playing first song in new queue:\n\t${song.name}`);

    queue.data.updateNowPlaying(client, song);
  };
