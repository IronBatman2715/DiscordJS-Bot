const { Interaction } = require("discord.js");
const Client = require("../structures/Client.js");
const Event = require("../structures/Event.js");

module.exports = new Event(
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  async (client, interaction) => {
    /*if (interaction.isSelectMenu()) {
      //console.log("Interaction created: ", interaction);

      let helpCommand = client.commands.find((cmd) => cmd.name == "help");

      if (interaction.values[0] == "Option 2 value") {
        return helpCommand.run(interaction, ["help", "music"], client);
      }

      return await interaction.reply(
        `You chose "${interaction.values[0]}" which did not match!`
      );
    }*/
  }
);
