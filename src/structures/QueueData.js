const Discord = require("discord.js");
const Client = require("./Client.js");
const DMP = require("discord-music-player");

class QueueData {
  #embedMessage;

  /**
   * @param {Discord.Message} initialMessage
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
   * @param {DMP.Song} song
   */
  async updateNowPlaying(client, song) {
    //Create now playing embed
    const nowPlayingEmbed = new Discord.MessageEmbed({
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

    //Send/upadate and save embed as message
    this.setEmbedMessage(
      await this.musicTextChannel.send({
        embeds: [nowPlayingEmbed],
        files: ["./src/resources/icons/music.png"],
      })
    );
  }

  async deleteEmbedMessage() {
    if (typeof this.#embedMessage !== "undefined") {
      if (!this.#embedMessage.deleted) {
        return await this.#embedMessage.delete();
      }
    }
    return;
  }

  /**
   * @param {Discord.Message} newEmbedMessage
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

    if (newEmbedMessage.deleted) {
      return console.error(
        "Error => QueueData.setEmbedMessage: newEmbedMessage is already deleted!"
      );
    }

    this.deleteEmbedMessage();

    this.#embedMessage = newEmbedMessage;
    return;
  }
}

module.exports = QueueData;
