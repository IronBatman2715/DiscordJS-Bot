const Discord = require("discord.js");
const Command = require("./Command.js");
const log = require("../functions/log.js");

module.exports = class Client extends Discord.Client {
  constructor() {
    console.log("*** DISCORD JS BOT: INITIALIZATION ***");

    super({
      intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_VOICE_STATES],
      allowedMentions: { repliedUser: false },
    });

    this.config = require("../resources/data/config.json"); //universal bot configs

    console.log("Loading ", this.config.name);
  }

  /** Register bot and login */
  start(token) {
    this.registerCommands();
    this.registerEvents();
    this.registerPlayerEvents();

    console.log("*** DISCORD JS BOT: INITIALIZATION DONE ***");

    log("Logging in... ");
    this.login(token);
  }

  /** Register slash commands */
  registerCommands() {
    console.log("Commands:");

    const devMode = true; //SET TO FALSE TO REGISTER NON-DEV COMMANDS TO GLOBAL

    this.commands = new Discord.Collection();
    let commandDataArr = [];
    const fs = require("fs");
    fs.readdirSync("./src/commands").forEach((folder) => {
      console.log(`\t${folder}`);
      fs.readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"))
        .forEach(
          /** @param {string} file */
          (file) => {
            /** @type {Command} */
            const command = require(`../commands/${folder}/${file}`);

            if (command.type != folder) {
              console.log("Improper type assigned to command: ", command.data.name);
            }

            if (command.type == "dev" && !devMode) {
              //do NOT register this command
            } else {
              this.commands.set(command.data.name, command);
              commandDataArr.push(command.data);

              console.log(`\t\t${command.data.name}`);
            }
          }
        );
    });

    //Register with DiscordAPI
    const { REST } = require("@discordjs/rest");
    const { Routes } = require("discord-api-types/v9");

    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

    (async () => {
      try {
        log("Registering commands with DiscordAPI...");

        if (devMode) {
          //Instantly register to test guild
          log(` DEV MODE. ONLY REGISTERING IN "TEST_GUILD_ID" FROM .ENV\n`);
          //rest.delete();
          await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.TEST_GUILD_ID),
            {
              body: commandDataArr,
            }
          );
        } else {
          //Register globally, will take a few minutes to register changes

          log(" DISTRIBUTION MODE. REGISTERING TO ANY SERVER THIS BOT IS IN\n");
          await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
            body: commandDataArr,
          });
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }

  /** Register discord events */
  registerEvents() {
    console.log("Events:");

    const fs = require("fs");
    fs.readdirSync("./src/events")
      .filter((file) => file.endsWith(".js"))
      .forEach(
        /** @param {string} file */
        (file) => {
          const eventName = file.slice(0, file.length - 3);
          const eventFunction = require(`../events/${file}`);

          //Tie to this instance
          this.on(eventName, eventFunction.bind(null, this));

          console.log(`\t${eventName}`);
        }
      );
  }

  /** Register discord music player events */
  registerPlayerEvents() {
    console.log("Player Events:");
    const { Player } = require("discord-music-player");
    const PlayerEvent = require("./PlayerEvent.js");

    this.player = new Player(this, {
      deafenOnJoin: true,
    });
    const fs = require("fs");
    fs.readdirSync("./src/playerEvents")
      .filter((file) => file.endsWith(".js"))
      .forEach((file) => {
        /** @type {string} */
        const playerEventName = file.slice(0, file.length - 3);
        /**
         * @type {PlayerEvent}
         */
        const playerEvent = require(`../playerEvents/${file}`);
        this.player.on(playerEventName, playerEvent.runFunction.bind(null, this));
        console.log(`\t${playerEventName}`);
      });
  }

  /**
   * @param {Discord.MessageEmbedOptions} data
   * @returns {MessageEmbed}
   */
  genEmbed(data = {}) {
    const embed = new Discord.MessageEmbed(data);

    if (!data.hasOwnProperty("timestamp")) {
      embed.setTimestamp(new Date());
    }
    if (!data.hasOwnProperty("color")) {
      embed.setColor("DARK_BLUE");
    }
    if (!data.hasOwnProperty("footer")) {
      embed.setFooter({
        text: this.config.name,
      });
    }

    return embed;
  }

  /**
   * Get the guild config data corresponding to guildId. If does not exist, generate based on defaults!
   * @typedef {{greetings: string[], maxMessagesCleared: Number, musicChannel: string, defaultRepeatMode: number}} GuildConfig
   * @param {string} guildId
   * @returns {GuildConfig}
   */
  getGuildConfig(guildId) {
    const fs = require("fs");
    let guildConfigFileName = fs
      .readdirSync("./src/resources/data/guilds")
      .filter((file) => file.endsWith(".json"))
      .filter((file) => file == `${guildId}.json`);

    switch (guildConfigFileName.length) {
      //Guild config file does not exist yet
      case 0: {
        console.log("Guild config file not present. Generating one with the default values!");

        guildConfigFileName = `${guildId}.json`;

        fs.copyFileSync(
          "./src/resources/data/guilds/default.json",
          `./src/resources/data/guilds/${guildConfigFileName}`
        );
      }
      case 1: {
        return require(`../resources/data/guilds/${guildConfigFileName}`);
      }

      default: {
        console.log(
          `Found multiple config files for a server [guilId: ${guildId}]! Using default for now.`
        );

        return require(`../resources/data/guilds/default.json`);
      }
    }
  }

  /**
   * @param {Command} command
   * @param {Discord.CommandInteraction} interaction
   * @param {any[]} args
   */
  async runCommand(command, interaction, args) {
    switch (command.type) {
      //Admin only commands
      case "admin": {
        const isUser = require("../functions/isUser.js");

        if (
          !isUser(interaction.member, {
            permissions: Discord.Permissions.FLAGS.ADMINISTRATOR,
          })
        ) {
          return interaction.followUp({
            content: `This is a administrator only command!`,
          });
        }
        break;
      }

      //Developer only commands
      case "dev": {
        const isUser = require("../functions/isUser.js");

        if (
          !isUser(interaction.member, {
            userIdList: process.env.DEV_IDS.includes(", ")
              ? process.env.DEV_IDS.split(", ")
              : process.env.DEV_IDS,
          })
        ) {
          return interaction.followUp({
            content: `This is a developer only command!`,
          });
        }
        break;
      }

      case "music": {
        const { musicChannel } = this.getGuildConfig(interaction.guildId);

        if (musicChannel != "" && interaction.channelId != musicChannel) {
          const musicChannelObj = await interaction.guild.channels.fetch(musicChannel);
          return interaction.followUp({
            content: `Must enter music commands in ${musicChannelObj}!`,
          });
        }
        break;
      }

      case "general":
      default: {
        break;
      }
    }

    try {
      await command.run(this, interaction, args);
      console.log(`Ran Commands/${command.type}/${command.data.name}`);
      console.log();
    } catch (error) {
      console.error(error);
      return interaction.followUp({
        content: `There was an error while executing \`${command.data.name}\` command!`,
      });
    }
  }
};
