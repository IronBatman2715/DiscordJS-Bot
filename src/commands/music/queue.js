const Command = require("../../structures/Command.js");
const repeatModeEnum2Str = require("../../functions/music/repeatModeEnum2Str.js");

module.exports = new Command(
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

    let queueFieldArr = guildQueue.songs.map((song, i) => {
      return {
        name: `${i + 1}: [${song.name}] (${song.url})`,
        value: `by: ${song.author}\nrequested by: ${song.requestedBy}\n`,
        inline: false,
      };
    });

    let repeatModeStr = repeatModeEnum2Str(guildQueue.repeatMode);
    repeatModeStr = repeatModeStr[0].toUpperCase() + repeatModeStr.slice(1).toLowerCase();

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
