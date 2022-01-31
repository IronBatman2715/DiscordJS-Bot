const { MessageSelectOption, MessageActionRow, MessageSelectMenu } = require("discord.js");
const Command = require("../../structures/Command");
const capitalize = require("../../functions/general/capitalize");

module.exports = new Command(
  {
    name: "help",
    description: "Shows a list of available commands.",
  },

  async (client, interaction, args) => {
    /** @type {MessageSelectOption[]} */
    const commandCategories = client.commandTypes
      .filter((type) => type !== "dev")
      .map((type) => {
        return {
          label: capitalize(type),
          value: type,
        };
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
