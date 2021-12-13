const tempMessage = require("../../functions/tempMessage.js");
const Command = require("../../structures/Command.js");

module.exports = new Command({
  name: "clear",
  aliases: ["c"],
  extraArguments: [
    {
      name: "# of messages",
      type: "integer",
      required: true,
      range: [1, Number.MAX_SAFE_INTEGER],
    },
  ],
  description:
    "Clear an amount of messages. This command can NOT clear messages older than 2 weeks (discord.js limitation)!",
  permissions: ["ADMINISTRATOR"],

  async run(message, args, client) {
    const { maxMessagesCleared } = client.getGuildConfig(message.guildId);

    const numLinesToClear = parseInt(args[1]);
    if (numLinesToClear > maxMessagesCleared) {
      return message.reply(
        `You can not clear more than ${maxMessagesCleared} messages!`
      );
    }
    if (numLinesToClear <= 0) {
      return message.reply(`Cannot clear a non-positive number of messages!`);
    }

    const channel = message.channel;
    let messagesToDelete;
    await channel.messages
      .fetch({ limit: numLinesToClear, before: message.id })
      .then((messages) => (messagesToDelete = messages))
      .catch(() => {
        return message.reply(
          `Command/${this.name}: Errored fetching messages to delete!`
        );
      });

    //Note: 2nd command in bulkDelete filters out messages >=2 weeks old, as they cannot be deleted via bulkDelete
    await channel.bulkDelete(messagesToDelete, true).catch(() => {
      return message.reply(`Command/${this.name}: Errored deleting messages!`);
    });

    await message.delete().catch(() => {
      return channel.send(
        `Command/${this.name}: Errored deleting clear command message!`
      );
    });

    //Confirmation message
    await tempMessage(
      channel,
      `Cleared \`${numLinesToClear}\` message${
        numLinesToClear == 1 ? "" : "s"
      }`,
      true,
      3,
      1
    );
  },
});
