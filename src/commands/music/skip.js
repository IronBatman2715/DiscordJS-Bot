const Command = require("../../structures/Command.js");

module.exports = new Command({
  name: "skip",
  description: "Skip current song.",

  async run(message, args, client) {
    let guildQueue;
    if (client.player.hasQueue(message.guild.id)) {
      guildQueue = client.player.getQueue(message.guild.id);
    } else {
      return message.reply(
        "Cannot skip a song in a queue has not been started!"
      );
    }

    guildQueue.skip();
    message.react("👌");
  },
});
