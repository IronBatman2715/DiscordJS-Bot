const { Guild } = require("discord.js");

const settingsInfo = require("../resources/data/settingsInfo");

/**
 * @typedef {{name: string, type: string, value: number | string | string[], range?: number[]}} ArgData
 * @param {ArgData} arg
 * @param {Guild} guild
 */
module.exports = async (arg, guild) => {
  const settingsFilter = settingsInfo.filter((setting) => setting.name == arg.name);

  if (settingsFilter.length == 1) {
    const [setting] = settingsFilter;

    switch (setting.name) {
      case "musicChannel": {
        return (await guild.channels.fetch(arg.value)).name;
      }
      case "defaultRepeatMode": {
        const repeatModeEnum2Str = require("./music/repeatModeEnum2Str");
        return repeatModeEnum2Str(arg.value);
      }

      default:
        return arg.value;
    }
  }

  console.log("Could not match arg.name with settingInfo.name!");
  return "** ERRORED RETRIEVING **";
};
