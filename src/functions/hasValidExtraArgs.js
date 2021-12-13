const Discord = require("discord.js");
const Client = require("../structures/Client.js");
const Command = require("../structures/Command.js");
const isValidArg = require("./isValidArg.js");

/**
 * @param {Command} command
 * @param {Discord.Message | Discord.Interaction} message
 * @param {string[]} args
 * @param {Client} client
 * @returns {boolean}
 */
module.exports = (command, message, args, client) => {
  const numOfExtraArgsEntered = args.length - 1; //subtract command name argument

  for (let i = 0; i < command.extraArguments.length; i++) {
    const extraArgumentNumber = i + 1;
    const wasThisExtraArgEntered = numOfExtraArgsEntered >= extraArgumentNumber;

    const extraArgument = {
      name: command.extraArguments[i].name,
      type: command.extraArguments[i].type.toLowerCase(),
      required: command.extraArguments[i].required,
      value: args[extraArgumentNumber],
      range: command.extraArguments[i].range,
    };

    //Check number of extra arguments matches up with optional and required sequence
    if (!wasThisExtraArgEntered) {
      if (extraArgument.required) {
        //console.log(`Extra argument ${extraArgumentNumber} is required!`);
        message.reply(`Invalid number of arguments entered!`);
        return false;
      } else {
        //console.log("Reached an optional extra argument that was not entered! Exiting extra arguments check!");
        return true;
      }
    }

    //Check if data type is valid
    if (!isValidArg(extraArgument)) {
      message.reply(
        `Invalid entry for argument: \`${extraArgument.name}\`!\nCheck \`${
          client.getGuildConfig(message.guildId).prefix
        }help\`.`
      );
      return false;
    }
  }
  return true;
};
