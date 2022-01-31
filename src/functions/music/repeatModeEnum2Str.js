const { RepeatMode } = require("discord-music-player");

module.exports =
  /**
   * @param {RepeatMode} repeatMode
   * @returns {String}
   */
  (repeatMode) => {
    switch (repeatMode) {
      case RepeatMode.DISABLED:
        return "DISABLED";
      case RepeatMode.SONG:
        return "SONG";
      case RepeatMode.QUEUE:
        return "QUEUE";

      default: {
        console.log("Error in repeatModeEnum2Str!");
        return "DISABLED";
      }
    }
  };
