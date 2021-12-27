const Command = require("../../structures/Command.js");

module.exports = new Command({
  name: "shuffle",
  description: "Shuffles the songs currently in the music queue.",

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

    guildQueue.shuffle();
    message.react("👌");
  },
});
