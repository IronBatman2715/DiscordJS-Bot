const { RepeatMode } = require("discord-music-player");
const Command = require("../../structures/Command.js");

module.exports = new Command(
  "music",
  {
    name: "queue",
    description: "Display music queue.",
  },

  async (client, interaction, args) => {
    //Get queue
    let guildQueue;
    if (client.player.hasQueue(interaction.guildId)) {
      guildQueue = client.player.getQueue(interaction.guildId);
    } else {
      return interaction.followUp({ content: "A queue has not been started!" });
    }

    //Argument(s) check
    if (args.length > 1) {
      return interaction.followUp({
        content: `Invalid entry! Refer to the help entry on ${this.name}!`,
      });
    }

    //Display queue
    if (guildQueue.songs.length == 0) {
      return interaction.followUp({ content: "No songs in queue!" });
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
        repeatModeStr = "Disabled";
        break;
    }

    const queueEmbed = client.genEmbed({
      title: `Music Queue (${guildQueue.songs.length} song${
        guildQueue.songs.length == 1 ? "" : "s"
      }) [Repeat mode: ${repeatModeStr}]`,
      fields: queueFieldArr,
      thumbnail: {
        url: "attachment://music.png",
      },
    });

    return await interaction.followUp({
      embeds: [queueEmbed],
      files: ["./src/resources/assets/icons/music.png"],
    });
  }
);
