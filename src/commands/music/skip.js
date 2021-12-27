const Command = require("../../structures/Command.js");

module.exports = new Command(
  "music",
  {
    name: "skip",
    description: "Skip current song.",
  },

  async (client, interaction, args) => {
    let guildQueue;
    if (client.player.hasQueue(interaction.guildId)) {
      guildQueue = client.player.getQueue(interaction.guildId);
    } else {
      return interaction.followUp({
        content: "Cannot skip a song in a queue has not been started!",
      });
    }

    guildQueue.skip();

    await interaction.deleteReply();
  }
);
