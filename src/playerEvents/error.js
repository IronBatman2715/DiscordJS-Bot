const PlayerEvent = require("../structures/PlayerEvent.js");

module.exports = new PlayerEvent("error", (client, error, queue) => {
  console.error(`Error: ${error} in ${queue.guild.name}!`);
});
