const { MessageEmbed } = require("discord.js");
const { RepeatMode } = require("discord-music-player");
const Command = require("../../structures/Command.js");

module.exports = new Command({
  name: "queue",
  aliases: ["q"],
  description: "Get music queue.",

  async run(message, args, client) {
    //Get queue
    let guildQueue;
    if (client.player.hasQueue(message.guild.id)) {
      guildQueue = client.player.getQueue(message.guild.id);
    } else {
      return message.reply("A queue has not been started!");
    }

    //Argument(s) check
    if (args.length > 1) {
      return message.reply(
        `Invalid entry! Refer to the help entry on ${this.name}!`
      );
    }

    //Display queue
    if (guildQueue.songs.length == 0) {
      return message.reply("No songs in queue!");
    }

    let queueFieldArr = [];
    for (let i = 0; i < guildQueue.songs.length; i++) {
      queueFieldArr[i] = {
        name: `${i + 1}: [${guildQueue.songs[i].name}] (${
          guildQueue.songs[i].url
        })`,
        value: `by: ${guildQueue.songs[i].author}\nrequested by: ${guildQueue.songs[i].requestedBy}\n`,
        inline: false,
      };
    }

    let repeatModeStr;
    switch (guildQueue.repeatMode) {
      case RepeatMode.SONG:
        repeatModeStr = "Song";
        break;
      case RepeatMode.QUEUE:
        repeatModeStr = "Queue";
        break;

      default:
        guildQueue.setRepeatMode(RepeatMode.DISABLED);
      case RepeatMode.DISABLED:
        repeatModeStr = "None";
        break;
    }
    const helpEmbed = new MessageEmbed({
      title: `Music Queue (${guildQueue.songs.length} song${
        guildQueue.songs.length == 1 ? "" : "s"
      }) [Repeat mode: ${repeatModeStr}]`,
      timestamp: message.createdTimestamp,
      color: "DARK_BLUE",
      fields: queueFieldArr,
      thumbnail: {
        url: "https://icons.iconarchive.com/icons/blackvariant/button-ui-system-folders-drives/1024/Music-icon.png",
      },
      footer: {
        text: `${client.config.name} v${client.config.version}`,
      },
    });

    return await message.reply({ embeds: [helpEmbed] });
  },
});
