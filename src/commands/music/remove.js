const Command = require("../../structures/Command.js");
const tempMessage = require("../../functions/discord/tempMessage.js");
const isInRange = require("../../functions/general/isInRange.js");
const { ApplicationCommandOptionType } = require("discord-api-types/v9");

module.exports = new Command(
  "music",
  {
    name: "remove",
    description: "Remove a song from music queue.",
    options: [
      {
        name: "queuenumber",
        description: "Number of song in queue.",
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
    ],
  },

  async (client, interaction, args) => {
    //Add ability to remove multiple eventually..?

    //Get queue
    let guildQueue;
    if (client.player.hasQueue(interaction.guildId)) {
      guildQueue = client.player.getQueue(interaction.guildId);
    } else {
      return interaction.followUp({ content: "A queue has not been started!" });
    }

    if (args.length != 1) {
      return interaction.followUp({
        content:
          "Must enter the number of the song you want to remove! Refer to the help entry on remove!",
      });
    }

    const [index] = args;
    if (!isInRange(index, 1, guildQueue.songs.length)) {
      return interaction.followUp({
        content: `Must enter the song's place in the queue! (Ex: Remove 3rd song in queue: "/remove 3")`,
      });
    }

    console.log("Input removal index: ", index);
    index -= 1; //convert from place in queue to array index
    console.log("Array-wise removal index: ", index);
    if (index < 0 || index > guildQueue.songs.length) {
      return interaction.followUp({
        content: "Song number entered does not exist in this queue!",
      });
    }

    const removedSong = guildQueue.songs[index];
    guildQueue.remove(index);
    index += 1; //revert from array index to place in queue

    /** @type {string} */
    let ordinalSuffix;
    switch (index) {
      case 1:
        ordinalSuffix = "st";
        break;
      case 2:
        ordinalSuffix = "nd";
        break;
      case 3:
        ordinalSuffix = "rd";
        break;

      default:
        ordinalSuffix = "th";
        break;
    }
    tempMessage(
      interaction.channel,
      `Removed the ${index}${ordinalSuffix} song from the queue! (${removedSong.name})`
    );
  }
);
