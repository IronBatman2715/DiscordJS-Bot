const Command = require("../../structures/Command");

module.exports = new Command(
  {
    name: "shuffle",
    description: "Shuffles the songs currently in the music queue.",
  },

  async (client, interaction, args) => {
    //Get queue
    let guildQueue;
    if (client.player.hasQueue(interaction.guildId)) {
      guildQueue = client.player.getQueue(interaction.guildId);
    } else {
      return interaction.followUp({ content: "A queue has not been started!" });
    }

    guildQueue.shuffle();

    await interaction.deleteReply();
  }
);
