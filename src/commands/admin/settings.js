const { CommandInteraction, EmbedFieldData } = require("discord.js");
const Client = require("../../structures/Client.js");
const Command = require("../../structures/Command.js");
const {
  ApplicationCommandOptionType,
  ChannelType,
} = require("discord-api-types/v9");
const { RepeatMode } = require("discord-music-player");

/**
 * @typedef {{name: string, type: string, range?: number[], description: string}} SettingsInfo
 * @type {SettingsInfo[]}
 */
const settingsInfo = require("../../resources/data/guilds/settingsInfo.js");

module.exports = new Command(
  "admin",
  {
    name: "settings",
    description: "ADMIN ONLY: Change/view guild settings.",
    defaultPermission: false,
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
            description:
              "Allow any text channel to be used for music commands.",
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
          return await interaction.followUp({
            content: "Subcommand is not working currently (WIP)!",
          });
          return await resetSettings(interaction, client);
        }

        default: {
          return await interaction.followUp({
            content: "Error is settings! Tell dev please!",
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

    const [settingsOption, value] = args;
    //User entered a new value for this 2 argument setting
    return await changeSetting(interaction, client, settingsOption, value);
  }
);

/**
 * @param {CommandInteraction} interaction
 * @param {Client} client
 */
async function displayCurrentSettings(interaction, client) {
  const currentGuildConfig = client.getGuildConfig(interaction.guildId);

  /** @type {EmbedFieldData[]} */
  let settingsFieldArr = [];
  for (const propt in currentGuildConfig) {
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
     * @typedef {{name: string, type: string, value: number | string, range?: number[]}} ArgData
     * @type {ArgData}
     */
    const argData = {
      name: propt,
      type: "",
      value: currentValue,
    };

    const getSettingDisplayValue = require("../../functions/getSettingDisplayValue.js");

    settingsFieldArr.push({
      name: `\`${propt}\`: \`${await getSettingDisplayValue(
        argData,
        interaction.guild
      )}\``,
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
    const fs = require("fs");
    fs.copyFileSync(
      "./src/resources/data/guilds/default.json",
      `./src/resources/data/guilds/${interaction.guildId}.json`
    );

    return interaction.followUp({
      content: `Reset guild/server settings!`,
    });
  } catch (error) {
    console.error(error);

    return interaction.followUp({
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
async function changeSetting(
  interaction,
  client,
  settingName,
  newSettingValue
) {
  const [setting] = settingsInfo.filter(
    (setting) => setting.name.toLowerCase() == settingName
  );

  const currentGuildConfig = client.getGuildConfig(interaction.guildId);

  /**
   * @typedef {{name: string, type: string, value: number | string, range?: number[]}} ArgData
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
  if (
    (typeof newValueArg.value).toLowerCase() == "number" &&
    newValueArg.range != []
  ) {
    console.log("Checking if number is in range");
    const isInRange = require("../../functions/isInRange.js");
    if (
      !isInRange(newValueArg.value, newValueArg.range[0], newValueArg.range[1])
    ) {
      return await interaction.followUp({
        content: `Entered value is out of allowed range: [${newValueArg.range[0]}, ${newValueArg.range[1]}]!`,
      });
    }
  }

  let newGuildConfig = currentGuildConfig;
  newGuildConfig[newValueArg.name] =
    newValueArg.type == "integer"
      ? Number(newValueArg.value)
      : newValueArg.value;
  console.log(
    `New guild config [GuildId: ${interaction.guildId}]\n`,
    newGuildConfig,
    "\n"
  );

  const fs = require("fs");
  fs.writeFileSync(
    `./src/resources/data/guilds/${interaction.guildId}.json`,
    JSON.stringify(newGuildConfig, null, "\t")
  );
  console.log(
    `Saved new guild config [GuildId: ${interaction.guildId}]\n`,
    client.getGuildConfig(interaction.guildId),
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
