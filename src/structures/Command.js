const Client = require("./Client.js");
const { CommandInteraction } = require("discord.js");
const { RESTPostAPIApplicationCommandsJSONBody } = require("discord-api-types/v9");

/**
 * @param {Client} client
 * @param {CommandInteraction} interaction
 * @param {any[]} args
 */
async function RunFunction(client, interaction, args) {}

module.exports = class Command {
  /** @type {string} _ denotes protected */
  _type;

  /**
   * @param {RESTPostAPIApplicationCommandsJSONBody} data
   * @param {RunFunction} run
   */
  constructor(data, run) {
    this.data = data;
    this.run = run;
  }

  /** @param {string} type */
  setType(type) {
    this._type = type;
  }

  get type() {
    return this._type;
  }
};
