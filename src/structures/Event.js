const { ClientEvents } = require("discord.js");
const Client = require("./Client.js");

/**
 * @template {keyof ClientEvents} K
 * @param {Client} client
 * @param {ClientEvents[K]} eventArgs
 */
function RunFunction(client, ...eventArgs) {}

/**
 * @template {keyof ClientEvents} K
 */
module.exports = class Event {
  /** @param {RunFunction<K>} runFunction */
  constructor(runFunction) {
    this.runFunction = runFunction;
  }
};
