const { ApplicationCommandOptionType } = require("discord-api-types/v9");
const Command = require("../../structures/Command.js");
const isInRange = require("../../functions/isInRange.js");

module.exports = new Command(
  "general",
  {
    name: "roll",
    description: "Roll the dice!",
    options: [
      {
        name: "quantity",
        description: "Number of dice to roll.",
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
      {
        name: "sides",
        description: "Sides of dice to roll.",
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
      {
        name: "modifier",
        description: "Value to add/subtract from result. [default: 0]",
        type: ApplicationCommandOptionType.Integer,
        required: false,
      },
    ],
  },

  async (client, interaction, args) => {
    /** @type {Number[]} */
    const [quantity, sides] = args;

    /** @type {Number} */
    let tempModifier;
    if (args.length < 3) {
      tempModifier = 0;
    } else {
      tempModifier = args[2];
    }
    const modifier = tempModifier;

    //Verify arguments
    if (!isInRange(quantity)) {
      return await interaction.followUp({
        content: `Number of dice must be greater than 0! Entered: ${quantity}`,
      });
    }
    if (!isInRange(sides, 2)) {
      return await interaction.followUp({
        content: `Sides of dice must be greater than 1! Entered: ${sides}`,
      });
    }

    /** @type {Number[]} */
    let results = new Array(quantity);
    for (let i = 0; i < results.length; i++) {
      results[i] = Math.floor(Math.random() * sides) + 1;
    }

    const total = results.reduce((a, b) => a + b) + modifier;

    let modifierStr = "";
    if (modifier != 0) {
      if (modifier > 0) {
        modifierStr = ` + ${modifier}`;
      } else {
        modifierStr = ` - ${Math.abs(modifier)}`;
      }
    }

    const multiDiceStr = quantity > 1 ? ` [${results}]${modifierStr}` : "";

    return await interaction.followUp({
      content: `${quantity}d${sides}${modifierStr} ➡️${multiDiceStr} = ${total}`,
    });
  }
);
