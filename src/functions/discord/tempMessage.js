const { Message, CommandInteraction } = require("discord.js");

/**
 * @param {CommandInteraction} interaction
 * @param {string} text
 * @param {boolean} showCountdown [default: true]
 * @param {Number} durationInSeconds [default: 10]
 * @param {Number} countdownIntervalInSeconds [default: 2]
 */
module.exports = async (
  interaction,
  text,
  showCountdown = true,
  durationInSeconds = 10,
  countdownIntervalInSeconds = 2
) => {
  if (durationInSeconds <= 0) {
    return console.log("tempMessage called with non-positive duration, not sending message.");
  }
  if (!Number.isInteger(durationInSeconds) || !Number.isInteger(countdownIntervalInSeconds)) {
    return console.log(
      "tempMessage called with non-integer duration OR countdown interval, not sending message."
    );
  }

  try {
    //console.log("Ticking tempMessage");
    if (showCountdown) {
      //Show countdown to when message will delete itself
      let newText = text + `...`;
      const message = await interaction.followUp({
        content: newText + durationInSeconds.toString(),
      });

      setTimeout(() => {
        countdown(
          durationInSeconds - countdownIntervalInSeconds,
          countdownIntervalInSeconds,
          message,
          newText
        );
      }, 1000 * countdownIntervalInSeconds);
    } else {
      //No visible countdown to when message will delete itself
      const message = await interaction.followUp({ content: text });

      setTimeout(() => {
        message.delete();
      }, 1000 * durationInSeconds);
    }
    //console.log("Done ticking tempMessage!");
  } catch (error) {
    console.error(error);
  }
};

/**
 * @param {Number} t
 * @param {Number} countdownIntervalInSeconds
 * @param {Message} tempMessage
 * @param {string} text
 */
async function countdown(t, countdownIntervalInSeconds, tempMessage, newText) {
  const tempMsg = await tempMessage.edit({ content: newText + t.toString() });

  if (t <= 0) {
    await tempMsg.delete();
    return;
  } else {
    setTimeout(() => {
      countdown(t - countdownIntervalInSeconds, countdownIntervalInSeconds, tempMsg, newText);
    }, 1000 * countdownIntervalInSeconds);
  }
}
