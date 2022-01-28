const { readdirSync } = require("fs");
const { MessageSelectOption, MessageActionRow, MessageSelectMenu } = require("discord.js");
const Command = require("../../structures/Command.js");

module.exports = new Command(
  "general",
  {
    name: "help",
    description: "Shows a list of available commands.",
  },

  async (client, interaction, args) => {
    /** @type {MessageSelectOption[]} */
    let commandCategories = [];
    readdirSync("./src/commands").forEach((folder) => {
      if (folder != "dev") {
        commandCategories.push({
          label: folder[0].toUpperCase() + folder.slice(1),
          value: folder,
        });
      }
    });

    const row = new MessageActionRow({
      components: [
        new MessageSelectMenu({
          custom_id: `${client.config.name}-help-select-menu`,
          placeholder: "Select a Command category",
          minValues: 1,
          maxValues: 1,
          options: commandCategories,
        }),
      ],
      type: "SELECT_MENU",
    });

    const helpDropdownEmbed = client.genEmbed({
      title: "Select a command category below!",
    });

    await interaction.followUp({
      embeds: [helpDropdownEmbed],
      components: [row],
    });
  }
);
