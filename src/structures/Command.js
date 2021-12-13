const Discord = require("discord.js");
const Client = require("./Client.js");

/**
 *
 * @param {Discord.Message | Discord.Interaction} message
 * @param {string[]} args
 * @param {Client} client
 */
function RunFunction(message, args, client) {}

class Command {
  #defaultCommandOptions = {
    aliases: [],
    extraArguments: [],
    permissions: [],
  };

  #defaultExtraArgumentOptions = {
    range: [],
  };

  /**
   * @typedef {{name: string, aliases?: string[], extraArguments?: ExtraArgumentOptions[], type?: string, description: string, permissions?: Discord.PermissionString[], run: RunFunction}} CommandOptions
   * @param {CommandOptions} options
   */
  constructor(options) {
    //Automatic property (defined in Client.js)
    //this.type = "folder name";

    for (const propt in options) {
      this[propt] = options[propt];
    }

    //Check for optional CommandOptions properties and set as default if not entered
    for (const propt in this.#defaultCommandOptions) {
      if (!this.hasOwnProperty(propt)) {
        this[propt] = this.#defaultCommandOptions[propt];
      }
    }

    //Check for optional ExtraArgumentOptions properties and set as default if not entered
    this.extraArguments.forEach((extraArgument) => {
      for (const propt in this.#defaultExtraArgumentOptions) {
        if (!extraArgument.hasOwnProperty(propt)) {
          extraArgument[propt] = this.#defaultExtraArgumentOptions[propt];
        }
      }
    });
  }
}

module.exports = Command;
