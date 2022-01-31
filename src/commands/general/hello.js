const Command = require("../../structures/Command.js");

module.exports = new Command(
  {
    name: "hello",
    description: "Replies with a greeting!",
  },

  async (client, interaction, args) => {
    const { greetings } = await client.DB.getGuildConfig(interaction.guildId);

    const index = Math.floor(Math.random() * greetings.length);

    return await interaction.followUp({ content: greetings[index] });
  }
);
