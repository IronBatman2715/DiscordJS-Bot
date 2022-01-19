const Command = require("../../structures/Command.js");

module.exports = new Command(
  "music",
  {
    name: "resume",
    description: "Resume paused music.",
  },

  async (client, interaction, args) => {
    let guildQueue;
    if (client.player.hasQueue(interaction.guildId)) {
      guildQueue = client.player.getQueue(interaction.guildId);
    } else {
      return interaction.followUp({
        content: `The queue is empty! Add a song or playlist using "/play"`,
      });
    }

    guildQueue.setPaused(false);

    await interaction.deleteReply();
  }
);
