const { CommandInteraction, EmbedFieldData } = require("discord.js");
const Client = require("../../structures/Client.js");
const Command = require("../../structures/Command.js");
const { ApplicationCommandOptionType, ChannelType } = require("discord-api-types/v9");
const { RepeatMode } = require("discord-music-player");

/**
 * @typedef {{name: string, type: string, range?: number[], description: string}} SettingsInfo
 * @type {SettingsInfo[]}
 */
const settingsInfo = require("../../resources/data/settingsInfo.js");

module.exports = new Command(
  "admin",
  {
    name: "settings",
    description: "ADMIN ONLY: Change/view guild settings.",
    options: [
      {
        name: "display",
        description: "Show current settings for this guild/server.",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "reset",
        description: "Resets this guild/server's settings to default!",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: settingsInfo[0].name.toLowerCase(), //greetings
        description: settingsInfo[0].description,
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "value",
            description: `New value to assign to ${settingsInfo[0].name.toLowerCase()}.`,
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: settingsInfo[1].name.toLowerCase(), //maxMessagesCleared
        description: settingsInfo[1].description,
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "quantity",
            description: `New value to assign to ${settingsInfo[1].name.toLowerCase()}.`,
            type: ApplicationCommandOptionType.Integer,
            required: true,
          },
        ],
      },

      {
        name: settingsInfo[2].name.toLowerCase(), //musicChannel
        description: settingsInfo[2].description,
        type: ApplicationCommandOptionType.SubcommandGroup,
        options: [
          {
            name: "add",
            description: "Overwrite/enable a designated music text channel.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: "textchannel",
                description: "The designated music text channel.",
                type: ApplicationCommandOptionType.Channel,
                channelTypes: [ChannelType.GuildText],
                required: true,
              },
            ],
          },
          {
            name: "disable",
            description: "Allow any text channel to be used for music commands.",
            type: ApplicationCommandOptionType.Subcommand,
          },
        ],
      },

      {
        name: settingsInfo[3].name.toLowerCase(), //defaultRepeatMode
        description: settingsInfo[3].description,
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "repeatmode",
            description: "New repeat mode to set.",
            type: ApplicationCommandOptionType.Integer,
            required: true,
            choices: [
              {
                name: "DISABLED",
                value: RepeatMode.DISABLED,
              },
              {
                name: "SONG",
                value: RepeatMode.SONG,
              },
              {
                name: "QUEUE",
                value: RepeatMode.QUEUE,
              },
            ],
          },
        ],
      },
    ],
  },

  async (client, interaction, args) => {
    if (args.length < 2) {
      switch (args[0]) {
        //User wants to see current settings
        case "display": {
          return await displayCurrentSettings(interaction, client);
        }

        //User wants to reset settings
        case "reset": {
          //Add in user confirmation..?
          return await resetSettings(interaction, client);
        }

        default: {
          return await interaction.followUp({
            content: "Error in settings! Tell dev please!",
          });
        }
      }
    }

    //If args[0] (AKA settingsOption) is possibly a 3 argument subcommand
    if (args[0] == "musicchannel") {
      const [settingsOption, action, value] = args;

      if (args.length == 2 || value == undefined || action == "disable") {
        return await changeSetting(interaction, client, settingsOption, "");
      }

      //User entered a new value for this 3 argument setting
      return await changeSetting(interaction, client, settingsOption, value);
    }

    //User entered a new value for this 2 argument setting
    const [settingsOption, value] = args;
    return await changeSetting(interaction, client, settingsOption, value);
  }
);

/**
 * @param {CommandInteraction} interaction
 * @param {Client} client
 */
async function displayCurrentSettings(interaction, client) {
  const currentGuildConfig = await client.DB.getGuildConfig(interaction.guildId);

  /** @type {EmbedFieldData[]} */
  let settingsFieldArr = [];
  for (const propt in currentGuildConfig) {
    //Ignore _id and __v
    if (propt[0] === "_" || propt === "guildId") continue;

    let currentValue = currentGuildConfig[propt];

    if (Array.isArray(currentGuildConfig[propt])) {
      const array = currentGuildConfig[propt];
      currentValue = "[ ";
      for (let i = 0; i < array.length; i++) {
        currentValue = currentValue + array[i];
        if (i != array.length - 1) {
          currentValue = currentValue + ", ";
        }
      }
      currentValue = currentValue + " ]";
    }

    const [setting] = settingsInfo.filter((setting) => setting.name == propt);

    /**
     * @typedef {{name: string, type: string, value: number | string | string[], range?: number[]}} ArgData
     * @type {ArgData}
     */
    const argData = {
      name: propt,
      type: setting.type,
      value: currentValue,
    };

    const getSettingDisplayValue = require("../../functions/getSettingDisplayValue.js");

    settingsFieldArr.push({
      name: `\`${propt}\`: \`${await getSettingDisplayValue(argData, interaction.guild)}\``,
      value: setting.description,
      inline: false,
    });
  }

  const currentSettingsEmbed = client.genEmbed({
    title: `${interaction.guild.name} [id: \`${interaction.guildId}\`] Server-wide Settings`,
    fields: settingsFieldArr,
    thumbnail: {
      url: "attachment://settings.png",
    },
  });

  return await interaction.followUp({
    embeds: [currentSettingsEmbed],
    files: ["./src/resources/assets/icons/settings.png"],
  });
}

/**
 * @param {CommandInteraction} interaction
 * @param {Client} client
 */
async function resetSettings(interaction, client) {
  try {
    //Reset
    await client.DB.deleteGuildConfig(interaction.guildId);

    //Generate new based on defaults
    await client.DB.getGuildConfig(interaction.guildId);

    return await interaction.followUp({
      content: `Reset guild/server settings!`,
    });
  } catch (error) {
    console.error(error);

    return await interaction.followUp({
      content: `FAILED to reset guild/server settings!`,
    });
  }
}

/**
 * @param {CommandInteraction} interaction
 * @param {Client} client
 * @param {string} settingName
 * @param {String | Number} newSettingValue
 */
async function changeSetting(interaction, client, settingName, newSettingValue) {
  const [setting] = settingsInfo.filter((setting) => setting.name.toLowerCase() == settingName);

  /**
   * @typedef {{name: string, type: string, value: number | string | string[], range?: number[]}} ArgData
   * @type {ArgData}
   */
  const newValueArg = {
    name: setting.name,
    type: setting.type,
    value: newSettingValue,
    range: setting.hasOwnProperty("range") ? setting.range : [],
  };
  console.log(`newValueArg: \n`, newValueArg, "\n");

  //DONT ALLOW CHANGING ARRAY SETTINGS FOR NOW
  if (newValueArg.type.endsWith("[]")) {
    return await interaction.followUp({
      content: `Currently not supporting changing settings with array data!`,
    });
  }

  //If entry is a number, check if it is in allowed range
  if ((typeof newValueArg.value).toLowerCase() == "number" && newValueArg.range != []) {
    console.log("Checking if number is in range");
    const isInRange = require("../../functions/general/isInRange.js");
    if (!isInRange(newValueArg.value, newValueArg.range[0], newValueArg.range[1])) {
      return await interaction.followUp({
        content: `Entered value is out of allowed range: [${newValueArg.range[0]}, ${newValueArg.range[1]}]!`,
      });
    }
  }

  await client.DB.updateGuildConfig(interaction.guildId, {
    [newValueArg.name]:
      newValueArg.type == "integer" ? Number(newValueArg.value) : newValueArg.value,
  });

  console.log(
    `Saved new guild config [GuildId: ${interaction.guildId}]\n`,
    await client.DB.getGuildConfig(interaction.guildId),
    "\n"
  );

  const getSettingDisplayValue = require("../../functions/getSettingDisplayValue.js");
  return await interaction.followUp({
    content: `Changed \`${newValueArg.name.toLowerCase()}\` to \`${await getSettingDisplayValue(
      newValueArg,
      interaction.guild
    )}\``,
  });
}
