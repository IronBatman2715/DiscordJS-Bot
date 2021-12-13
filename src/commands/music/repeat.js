const Command = require("../../structures/Command.js");
const DMP = require("discord-music-player");

module.exports = new Command({
  name: "repeat",
  extraArguments: [
    {
      name: "option",
      type: "string",
      required: true,
    },
  ],
  description: `Set the repeat mode of the music queue.`,

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
    let errorStr = `Must enter what you want to repeat after "repeat"! Options are: "none", "song", and "queue"
          \nEx: ${prefix}repeat song`;
    if (!(args.length == 1 || args.length == 2)) {
      return message.reply(errorStr);
    }

    //Change the repeat behvior of the queue
    switch (args[1].toLowerCase()) {
      case "stop":
      case "off":
      case "none":
        if (guildQueue.repeatMode == DMP.RepeatMode.DISABLED) {
          return message.reply("Already set to do no repeats!");
        }
        guildQueue.setRepeatMode(DMP.RepeatMode.DISABLED);
        return message.reply(
          "Neither the current song nor the queue will repeat now!"
        );
      case "song":
        if (guildQueue.repeatMode == DMP.RepeatMode.SONG) {
          return message.reply("Already set to repeat the current song!");
        }
        guildQueue.setRepeatMode(DMP.RepeatMode.SONG);
        return message.reply("The current song will repeat now!");
      case "queue":
        if (guildQueue.repeatMode == DMP.RepeatMode.QUEUE) {
          return message.reply("Already set to repeat the queue!");
        }
        guildQueue.setRepeatMode(DMP.RepeatMode.QUEUE);
        return message.reply("The queue will repeat now!");

      default:
        return message.reply(errorStr);
    }
  },
});
