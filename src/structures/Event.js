const Discord = require("discord.js");
const Client = require("./Client.js");

/**
 * @template {keyof Discord.ClientEvents} K
 * @param {Client} client
 * @param {Discord.ClientEvents[K]} eventArgs
 */
function RunFunction(client, ...eventArgs) {}

/**
 * @template {keyof Discord.ClientEvents} K
 */
class Event {
  /**
   * @param {string} name
   * @param {RunFunction<K>} runFunction
   */
  constructor(name, runFunction) {
    this.name = name;
    this.runFunction = runFunction;
  }
}

module.exports = Event;
