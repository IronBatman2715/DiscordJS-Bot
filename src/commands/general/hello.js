const Command = require("../../structures/Command.js");

module.exports = new Command({
  name: "hello",
  aliases: ["greetings"],
  description: "Replies hello!",

  async run(message, args, client) {
    const { greetings } = client.getGuildConfig(message.guildId);

    let index = Math.floor(Math.random() * greetings.length);

    await message.reply(greetings[index]);
  },
});
