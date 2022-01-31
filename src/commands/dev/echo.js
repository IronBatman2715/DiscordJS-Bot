const { ApplicationCommandOptionType } = require("discord-api-types/v9");
const Command = require("../../structures/Command");

module.exports = new Command(
  {
    name: "echo",
    description: "DEV ONLY: Repeats a message back to you!",
    options: [
      {
        name: "message",
        description: "Message to echo",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },

  async (client, interaction, args) => {
    const [message] = args;
    console.log("message: {", typeof message, "} ", message);

    return await interaction.followUp({ content: message });
  }
);
