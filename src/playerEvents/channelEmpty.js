const PlayerEvent = require("../structures/PlayerEvent.js");

module.exports = new PlayerEvent((client, queue) => {
  console.log("Everyone left the Voice Channel, queue ended!");
});
