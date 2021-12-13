const Command = require("../../structures/Command.js");

module.exports = new Command({
  name: "pause",
  description: "Pause music.",

  async run(message, args, client) {
    let guildQueue;
    if (client.player.hasQueue(message.guild.id)) {
      guildQueue = client.player.getQueue(message.guild.id);
    } else {
      return message.reply("Cannot pause a queue has not been started!");
    }

    guildQueue.setPaused(true);
    message.react("👌");
  },
});
