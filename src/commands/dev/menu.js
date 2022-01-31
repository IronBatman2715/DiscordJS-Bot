const { MessageActionRow, MessageSelectMenu, MessageSelectOption } = require("discord.js");
const Command = require("../../structures/Command.js");
const isInRange = require("../../functions/general/isInRange.js");
const { ApplicationCommandOptionType } = require("discord-api-types/v9");

module.exports = new Command(
  {
    name: "menu",
    description: "DEV ONLY: Shows a test menu.",
    options: [
      {
        name: "numberOfOptions".toLowerCase(),
        description: "Number of options to generate.",
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
    ],
  },

  async (client, interaction, args) => {
    const [numOfOptions] = args;

    //Check if is in allowed range
    if (!isInRange(numOfOptions)) {
      return await interaction.followUp({
        content: `Entered value is out of allowed range: [1, ${Number.MAX_SAFE_INTEGER}]!`,
      });
    }

    /** @type {MessageSelectOption[]} */
    let options = [];
    for (let i = 0; i < numOfOptions; i++) {
      let displayNum = i + 1;
      options[i] = {
        label: `Option ${displayNum} label`,
        value: `Option ${displayNum} value`,
        description: `Option ${displayNum} description`,
        emoji: `1️⃣`,
      };
    }

    const row = new MessageActionRow({
      components: [
        new MessageSelectMenu({
          custom_id: "test-select-menu-id",
          placeholder: "Choose something",
          minValues: 1,
          maxValues: 1,
          options: options,
        }),
      ],
      type: "SELECT_MENU",
    });

    await interaction.followUp({
      content: "Select something below!",
      components: [row],
    });
  }
);
