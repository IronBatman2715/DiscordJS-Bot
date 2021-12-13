const Command = require("../../structures/Command.js");

module.exports = new Command({
  name: "resume",
  description: "Resume paused music.",

  async run(message, args, client) {
    const { prefix } = client.getGuildConfig(message.guildId);

    let guildQueue;
    if (client.player.hasQueue(message.guild.id)) {
      guildQueue = client.player.getQueue(message.guild.id);
    } else {
      return message.reply(
        `The queue is empty! Add a song or playlist using "${prefix}play"`
      );
    }

    guildQueue.setPaused(false);
    message.react("👌");
  },
});
