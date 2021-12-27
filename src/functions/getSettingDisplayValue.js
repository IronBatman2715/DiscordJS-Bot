const { Guild } = require("discord.js");
const settingsInfo = require("../resources/data/guilds/settingsInfo.js");

module.exports =
  /**
   * @typedef {{name: string, type: string, value: number | string, range?: number[]}} ArgData
   * @param {ArgData} arg
   * @param {Guild} guild
   */
  async (arg, guild) => {
    const settingsFilter = settingsInfo.filter(
      (setting) => setting.name == arg.name
    );

    if (settingsFilter.length == 1) {
      const [setting] = settingsFilter;

      switch (setting.name) {
        case "musicChannel": {
          return (await guild.channels.fetch(arg.value)).name;
        }
        case "defaultRepeatMode": {
          const getRepeatMode = require("./getRepeatMode");
          return getRepeatMode(arg.value);
        }

        default:
          return arg.value;
      }
    }

    console.log("Could not match arg.name with settingInfo.name!");
    return "** ERRORED RETRIEVING **";
  };
