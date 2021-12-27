const Client = require("./Client.js");
const { CommandInteraction, ApplicationCommand } = require("discord.js");

/**
 * @param {Client} client
 * @param {CommandInteraction} interaction
 * @param {any[]} args
 */
async function RunFunction(client, interaction, args) {}

module.exports = class Command {
  /**
   * @param {string} type
   * @param {ApplicationCommand} data
   * @param {RunFunction} run
   */
  constructor(type, data, run) {
    this.type = type;
    this.data = data;
    this.run = run;
  }
};
