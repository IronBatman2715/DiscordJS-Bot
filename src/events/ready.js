const Client = require("../structures/Client.js");
const Event = require("../structures/Event.js");

module.exports = new Event(
  /**
   * @param {Client} client
   */
  (client) => {
    let unusedActivities = setRandomBotPresence(
      client,
      client.config.activities.slice()
    );

    console.log("Online and ready!\n");

    setInterval(() => {
      unusedActivities = setRandomBotPresence(client, unusedActivities);
    }, 3600000); // set random presence every 3600000 ms = 1 hour
  }
);

/**
 * @typedef {{type: string, name: string}} ActivitesOptions
 * @param {Client} client
 * @param {ActivitesOptions[]} unusedActivities
 * @returns {ActivitesOptions[]}
 */
function setRandomBotPresence(client, unusedActivities) {
  if (unusedActivities.length < 1) {
    unusedActivities = client.config.activities.slice();
  }
  const randomIndex = Math.floor(Math.random() * unusedActivities.length);

  client.user.setPresence({
    status: "online",
    afk: false,
    activities: [unusedActivities[randomIndex]],
  });

  unusedActivities.splice(randomIndex, 1);

  return unusedActivities;
}
