const Command = require("../../structures/Command");

module.exports = new Command(
  {
    name: "stop",
    description: "Stops playing music.",
  },

  async (client, interaction, args) => {
    let guildQueue;
    if (client.player.hasQueue(interaction.guildId)) {
      guildQueue = client.player.getQueue(interaction.guildId);
    } else {
      return interaction.followUp({
        content: "Cannot stop a queue has not been started!",
      });
    }

    guildQueue.stop();

    await interaction.deleteReply();
  }
);
