const Command = require("../../structures/Command.js");

module.exports = new Command({
  name: "stop",
  description: "Stops playing music.",

  async run(message, args, client) {
    let guildQueue;
    if (client.player.hasQueue(message.guild.id)) {
      guildQueue = client.player.getQueue(message.guild.id);
    } else {
      return message.reply("Cannot stop a queue has not been started!");
    }

    guildQueue.stop();
    message.react("👌");
  },
});
