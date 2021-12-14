const PlayerEvent = require("../structures/PlayerEvent.js");

module.exports = new PlayerEvent((client, queue) => {
  console.log(`I was kicked from the Voice Channel, queue ended.`);
});
