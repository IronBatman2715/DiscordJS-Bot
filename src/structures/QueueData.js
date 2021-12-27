const { Message, MessageEmbed } = require("discord.js");
const Client = require("./Client.js");
const { Song } = require("discord-music-player");

module.exports = class QueueData {
  #embedMessage;

  /**
   * @param {Message} initialMessage
   */
  constructor(initialMessage) {
    this.musicTextChannel = initialMessage.channel;
    this.initialMessage = initialMessage;
    this.latestMessage = initialMessage;
  }

  getEmbedMessage() {
    return this.#embedMessage;
  }

  /**
   *
   * @param {Client} client
   * @param {Song} song
   */
  async updateNowPlaying(client, song) {
    //Create now playing embed
    const nowPlayingEmbed = new MessageEmbed({
      title: "Now playing",
      description: `[${song.name}](${song.url})`,
      color: "DARK_BLUE",
      author: {
        name: song.requestedBy.username,
        iconURL: song.requestedBy.avatarURL({ dynamic: true }),
      },
      footer: {
        text: `${client.config.name} v${client.config.version}`,
      },
    }).setThumbnail("attachment://music.png");

    try {
      //Send/upadate and save embed as message
      this.setEmbedMessage(
        await this.musicTextChannel.send({
          embeds: [nowPlayingEmbed],
          files: ["./src/resources/assets/icons/music.png"],
        })
      );
    } catch (error) {
      console.error(error);
    }
  }

  async deleteEmbedMessage() {
    try {
      if (typeof this.#embedMessage !== "undefined") {
        return await this.#embedMessage.delete();
      }
      return;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @param {Message} newEmbedMessage
   */
  setEmbedMessage(newEmbedMessage) {
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

    this.deleteEmbedMessage();

    this.#embedMessage = newEmbedMessage;
    return;
  }
};
