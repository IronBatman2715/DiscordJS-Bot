const { RepeatMode } = require("discord-music-player");

/**
 * @param {RepeatMode} repeatMode
 * @returns {String}
 */
module.exports = (repeatMode) => {
  switch (repeatMode) {
    case RepeatMode.DISABLED:
      return "DISABLED";
    case RepeatMode.SONG:
      return "SONG";
    case RepeatMode.QUEUE:
      return "QUEUE";

    default: {
      console.log("Error in getRepeatMode!");
      return "DISABLED";
    }
  }
};
