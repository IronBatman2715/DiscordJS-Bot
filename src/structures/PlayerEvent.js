const Client = require("./Client.js");
const DMP = require("discord-music-player");

/**
 * @template {keyof DMP.PlayerEvents} K
 * @param {Client} client
 * @param {DMP.PlayerEvents[K]} eventArgs
 */
function RunFunction(client, ...eventArgs) {}

/**
 * @template {keyof DMP.PlayerEvents} K
 */
class PlayerEvent {
  /**
   * @param {string} name
   * @param {RunFunction<K>} runFunction
   */
  constructor(name, runFunction) {
    this.name = name;
    this.runFunction = runFunction;
  }
}

module.exports = PlayerEvent;
