const { Queue, Song } = require("discord-music-player");
const Client = require("../structures/Client.js");
const PlayerEvent = require("../structures/PlayerEvent.js");
const tempMessage = require("../functions/tempMessage.js");

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

    if (queue.isPlaying) {
      try {
        //Confirmation message
        tempMessage(
          queue.data.latestInteraction,
          `Queued \`${song.name}\`!`,
          true,
          3,
          1
        );
      } catch (error) {
        console.error(error);
      }
    }
  }
);
