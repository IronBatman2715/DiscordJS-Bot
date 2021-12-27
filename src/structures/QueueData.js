const { CommandInteraction, Message } = require("discord.js");
const Client = require("./Client.js");
const { Song } = require("discord-music-player");

module.exports = class QueueData {
  /** @type {Message} */
  #embedMessage;

  /**
   * @param {CommandInteraction} initialInteraction
   */
  constructor(initialInteraction) {
    this.musicTextChannel = initialInteraction.channel;
    this.initialInteraction = initialInteraction;
    this.latestInteraction = initialInteraction;
  }

  async getEmbedMessage() {
    return this.#embedMessage;
  }

  /**
   *
   * @param {Client} client
   * @param {Song} song
   */
  async updateNowPlaying(client, song) {
    //Create now playing embed
    const nowPlayingEmbed = client.genEmbed({
      title: "Now playing",
      description: `[${song.name}](${song.url})`,
      author: {
        name: song.requestedBy.username,
        iconURL: song.requestedBy.avatarURL({ dynamic: true }),
      },
      thumbnail: {
        url: "attachment://music.png",
      },
    });

    try {
      //Send/update and save embed as message
      const newEmbedMessage = await this.latestInteraction.followUp({
        embeds: [nowPlayingEmbed],
        files: ["./src/resources/assets/icons/music.png"],
      });

      this.setEmbedMessage(newEmbedMessage);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @param {Message} newEmbedMessage
   */
  async setEmbedMessage(newEmbedMessage) {
    if (newEmbedMessage.embeds.length != 1) {
      let str;
      switch (newEmbedMessage.embeds.length) {
        case 0:
          str = "no embeds!";
          break;
        default:
          str = "more than one embed!";
          break;
      }
      return console.error(
        `Error => QueueData.setEmbedMessage: newEmbedMessage has ${str}`
      );
    }

    await this.deleteEmbedMessage();

    this.#embedMessage = newEmbedMessage;
    return;
  }

  async deleteEmbedMessage() {
    try {
      if (!!this.#embedMessage) {
        await this.#embedMessage.delete();
      }
    } catch (error) {
      console.error(error);
    }
  }
};
