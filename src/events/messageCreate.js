const snakeCase2Display = require("../functions/snakeCase2Display.js");
const hasValidExtraArgs = require("../functions/hasValidExtraArgs.js");
const isUser = require("../functions/isUser.js");
const Discord = require("discord.js");
const Client = require("../structures/Client.js");
const Event = require("../structures/Event.js");

module.exports = new Event(
  "messageCreate",
  /**
   * @param {Client} client
   * @param {Discord.Message} message
   */
  async (client, message) => {
    const { prefix, designatedMusicChannelIds } = client.getGuildConfig(
      message.guildId
    ); //get this guild's command prefix

    //If a bot OR message does NOT start with prefix
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    //Format input message into passable arguments string[]
    const args = message.content.substring(prefix.length).split(/ +/);
    args[0] = args[0].toLowerCase();

    let command = client.commands.find((cmd) => cmd.name == args[0]);

    //If argument did not match command name => check aliases
    if (!command) {
      command = client.commands.find((cmd) => cmd.aliases.includes(args[0]));
    }

    //If argument did not match command name OR aliases => inform user it is not a valid command
    if (!command) {
      return message.reply(`\`${prefix}${args[0]}\` is not a valid command!`);
    }

    //If trying to run dev command while NOT being designated a dev
    if (command.type == "dev") {
      if (!isUser("dev", message.author.id)) {
        return message.reply(
          `\`${prefix}${args[0]}\` is a developer only command!`
        );
      }
    }

    //If does NOT have permissions requirement
    if (command.permissions.length > 0) {
      command.permissions.forEach((permission) => {
        if (!message.member.permissions.has(permission, true)) {
          return message.reply(
            `You do not have the permission to run this command: \`${snakeCase2Display(
              permission
            )}\``
          );
        }
      });
    }

    //Check extra arguments
    if (!hasValidExtraArgs(command, message, args, client)) return;

    //If trying to run music command in a text channel OTHER than the specified one
    if (command.type == "music") {
      if (designatedMusicChannelIds.length > 0) {
        const isInAMusicChannel =
          designatedMusicChannelIds.filter(
            (designatedMusicChannelId) =>
              designatedMusicChannelId == message.channelId
          ).length == 1;

        if (!isInAMusicChannel) {
          let musicChannelNames = [];
          for (let i = 0; i < designatedMusicChannelIds.length; i++) {
            const channel = await message.guild.channels.fetch(
              designatedMusicChannelIds[i]
            );
            musicChannelNames.push(channel.name);
          }

          let printMusicChannelNames = "";
          for (let i = 0; i < musicChannelNames.length; i++) {
            printMusicChannelNames =
              printMusicChannelNames + `\n - **${musicChannelNames[i]}**`;
          }

          return message.reply(
            `Must run music commands in ${
              musicChannelNames.length == 1
                ? "text channel"
                : "one of the following text channels"
            }:${printMusicChannelNames}`
          );
        }
      }
    }

    message.channel.sendTyping();

    command.run(message, args, client);

    console.log(
      `Successfully executed: Command/${command.type}/${command.name}`
    );
  }
);
