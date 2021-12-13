const Command = require("../../structures/Command.js");

module.exports = new Command({
  name: "roll",
  aliases: ["r"],
  extraArguments: [
    {
      name: `"number of dice"d"sides of dice`,
      type: "integer",
      required: true,
      range: [1, Number.MAX_SAFE_INTEGER],
    },
    {
      name: "modifier",
      type: "integer",
      required: false,
      range: [1, Number.MAX_SAFE_INTEGER],
    },
  ],
  description: "Roll the dice!",

  async run(message, args, client) {
    /*message
      .reply(
        `Rolling ${numOfDice}d${sidesOfDice}${modifierSign}${modifier} -> ${result}`
      )
      .then(() => {
        return;
      });*/
  },
});
