const Command = require("../../structures/Command.js");
const tempMessage = require("../../functions/tempMessage.js");

module.exports = new Command({
  name: "remove",
  extraArguments: [
    {
      name: "number in queue",
      type: "integer",
      required: true,
      range: [1, Number.MAX_SAFE_INTEGER],
    },
  ],
  description: "Remove song from music queue.",

  async run(message, args, client) {
    const { prefix } = client.getGuildConfig(message.guildId);

    //Get queue
    let guildQueue;
    if (client.player.hasQueue(message.guild.id)) {
      guildQueue = client.player.getQueue(message.guild.id);
    } else {
      return message.reply("A queue has not been started!");
    }

    //Argument(s) check
    if (args.length > 1) {
      return message.reply("Invalid entry! Refer to the help entry on queue!");
    }

    //remove.js: Remove a song from the queue (add ability to remove multiple eventually..?)
    if (args.length != 2) {
      return message.reply(
        "Must enter the number of the song you want to remove! Refer to the help entry on remove!"
      );
    }

    let index = parseInt(args[1]);
    if (isNaN(index)) {
      return message.reply(
        `Must enter the song's place in the queue! (Ex: Remove 3rd song in queue: "${prefix}remove 3")`
      );
    }

    console.log(`Input removal index: ${index}`);
    index -= 1; //convert from place in queue to array index
    console.log(`Array-wise removal index: ${index}`);
    if (index < 0 || index > guildQueue.songs.length) {
      return message.reply("Song number entered does not exist in this queue!");
    }

    const removedSong = guildQueue.songs[index];
    guildQueue.remove(index);
    index += 1; //revert from array index to place in queue

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
      message.channel,
      `Removed the ${index}${ordinalSuffix} song from the queue! (${removedSong.name})`
    );
  },
});
