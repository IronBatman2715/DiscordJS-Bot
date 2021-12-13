const Discord = require("discord.js");

/**
 * @param {Discord.TextChannel} channel
 * @param {string} text
 * @param {boolean} showCountdown [default: true]
 * @param {Number} durationInSeconds [default: 10]
 * @param {Number} countdownIntervalInSeconds [default: 2]
 */
module.exports = async (
  channel,
  text,
  showCountdown = true,
  durationInSeconds = 10,
  countdownIntervalInSeconds = 2
) => {
  if (durationInSeconds <= 0) {
    return console.log(
      "tempMessage called with non-positive duration, not sending message."
    );
  }
  if (
    !Number.isInteger(durationInSeconds) ||
    !Number.isInteger(countdownIntervalInSeconds)
  ) {
    return console.log(
      "tempMessage called with non-integer duration OR countdown interval, not sending message."
    );
  }

  //console.log("Ticking tempMessage");
  if (showCountdown) {
    //Show countdown to when message will delete itself
    let newText = text + `...`;
    channel.send(newText + durationInSeconds.toString()).then((message) => {
      setTimeout(() => {
        countdown(
          durationInSeconds - countdownIntervalInSeconds,
          countdownIntervalInSeconds,
          message,
          newText
        );
      }, 1000 * countdownIntervalInSeconds);
    });
  } else {
    //No visible countdown to when message will delete itself
    channel.send(text).then((message) => {
      setTimeout(() => {
        message.delete();
      }, 1000 * durationInSeconds);
    });
  }
  //console.log("Done ticking tempMessage!");
};

/**
 * @param {Number} t
 * @param {Number} countdownIntervalInSeconds
 * @param {Discord.Message} tempMessage
 * @param {string} text
 */
function countdown(t, countdownIntervalInSeconds, tempMessage, newText) {
  tempMessage.edit(newText + t.toString()).then((tempMsg) => {
    if (t <= 0) {
      tempMsg.delete().then(() => {
        return;
      });
    } else {
      setTimeout(() => {
        countdown(
          t - countdownIntervalInSeconds,
          countdownIntervalInSeconds,
          tempMsg,
          newText
        );
      }, 1000 * countdownIntervalInSeconds);
    }
    return;
  });
}
