const Command = require("../../structures/Command.js");

module.exports = new Command(
  {
    name: "ping",
    description: "Shows the ping of the bot.",
  },

  async (client, interaction, args) => {
    const clientPing = await interaction.followUp({
      content: `Ping: ${client.ws.ping} ms.`,
    });

    return await clientPing.edit({
      content: `Ping: ${client.ws.ping} ms. \nMessage Ping: ${
        clientPing.createdTimestamp - interaction.createdTimestamp
      } ms.`,
    });
  }
);
