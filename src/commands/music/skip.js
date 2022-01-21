const Command = require("../../structures/Command.js");
const { ApplicationCommandOptionType } = require("discord-api-types/v9");

module.exports = new Command(
  "music",
  {
    name: "skip",
    description: "Skip a number of song(s) [default: 1].",
    options: [
      {
        name: "quantity",
        description: "Number of songs to skip.",
        type: ApplicationCommandOptionType.Integer,
        required: false,
      },
    ],
  },

  async (client, interaction, args) => {
    let guildQueue;
    if (client.player.hasQueue(interaction.guildId)) {
      guildQueue = client.player.getQueue(interaction.guildId);
    } else {
      return await interaction.followUp({
        content: "Cannot skip a song in a queue that has not been started!",
      });
    }

    switch (args.length) {
      case 0: {
        if (guildQueue.songs.length == 1) {
          return await interaction.followUp({
            content: "Cannot skip as many or more songs than are in the queue!",
          });
        }
        guildQueue.skip();
        break;
      }
      case 1: {
        const [quantity] = args;

        const isInRange = require("../../functions/isInRange.js");
        if (!isInRange(quantity, 1, guildQueue.songs.length - 1)) {
          return await interaction.followUp({
            content: "Cannot skip as many or more songs than are in the queue!",
          });
        } else {
          guildQueue.skip(quantity - 1);
        }
        break;
      }

      default: {
        return await interaction.followUp({
          content: "Errored! Invalid argument count.",
        });
      }
    }

    return await interaction.deleteReply();
  }
);
