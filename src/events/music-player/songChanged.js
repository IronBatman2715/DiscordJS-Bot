const { Queue, Song } = require("discord-music-player");

const Client = require("../../structures/Client");

/**
 * @param {Client} client
 * @param {Queue} queue
 * @param {Song} newSong
 * @param {Song} oldSong
 */
module.exports = async (client, queue, newSong, oldSong) => {
  if (oldSong == newSong) {
    console.log(`Repeated song:\n\t${oldSong.name}`);
  } else {
    console.log(`Song changed from\n\t${oldSong.name}\n\t\tto\n\t${newSong.name}`);
  }

  queue.data.updateNowPlaying(client, newSong);
};
