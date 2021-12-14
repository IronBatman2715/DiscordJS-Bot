const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const Command = require("../../structures/Command.js");

module.exports = new Command({
  name: "menu",
  extraArguments: [
    {
      name: "number of options",
      type: "integer",
      required: true,
      range: [1, Number.MAX_SAFE_INTEGER],
    },
  ],
  description: "Shows a test menu.",
  permissions: ["ADMINISTRATOR"],

  async run(message, args, client) {
    //Argument check
    if (args.length != 2) {
      return await message.reply("Invalid number of arguments entered!");
    }
    let numToGen = parseInt(args[1]);
    if (!Number.isInteger(numToGen)) {
      return await message.reply("Invalid number of options requested!");
    }

    let options = [];
    for (let i = 0; i < numToGen; i++) {
      let displayNum = i + 1;
      options[i] = {
        label: `Option ${displayNum} label`,
        value: `Option ${displayNum} value`,
        description: `Option ${displayNum} description`,
        emoji: `1️⃣`,
      };
    }

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("test-select-menu-id")
        .setPlaceholder("Choose something")
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(options)
    );

    await message.reply({
      content: "Select something below!",
      components: [row],
    });
  },
});
