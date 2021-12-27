const Command = require("../../structures/Command.js");

module.exports = new Command(
  "music",
  {
    name: "pause",
    description: "Pause music.",
  },

  async (client, interaction, args) => {
    let guildQueue;
    if (client.player.hasQueue(interaction.guildId)) {
      guildQueue = client.player.getQueue(interaction.guildId);
    } else {
      return interaction.followUp({
        content: "Cannot pause a queue has not been started!",
      });
    }

    guildQueue.setPaused(true);

    await interaction.deleteReply();
  }
);
