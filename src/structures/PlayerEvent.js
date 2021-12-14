const Client = require("./Client.js");
const { PlayerEvents } = require("discord-music-player");

/**
 * @template {keyof DMP.PlayerEvents} K
 * @param {Client} client
 * @param {PlayerEvents[K]} eventArgs
 */
function RunFunction(client, ...eventArgs) {}

/**
 * @template {keyof PlayerEvents} K
 */
module.exports = class PlayerEvent {
  /** @param {RunFunction<K>} runFunction */
  constructor(runFunction) {
    this.runFunction = runFunction;
  }
};
