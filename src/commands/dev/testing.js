const Command = require("../../structures/Command.js");

module.exports = new Command(
  {
    name: "testing",
    description: 'DEV ONLY: Replies with "1, 2, 3!"!',
  },

  async (client, interaction, args) => {
    return await interaction.followUp({ content: "1, 2, 3!" });
  }
);
