const { Queue, Playlist } = require("discord-music-player");
const Client = require("../structures/Client.js");
const PlayerEvent = require("../structures/PlayerEvent.js");
const tempMessage = require("../functions/discord/tempMessage.js");

module.exports = new PlayerEvent(
  /**
   * @param {Client} client
   * @param {Queue} queue
   * @param {Playlist} playlist
   */
  async (client, queue, playlist) => {
    console.log(
      `${playlist.requestedBy.username} added this playlist to the queue:\n\t${playlist.name}`
    );

    try {
      //Confirmation message
      tempMessage(queue.data.latestInteraction, `Queued \`${playlist.name}\`!`, true, 3, 1);
    } catch (error) {
      console.error(error);
    }
  }
);
