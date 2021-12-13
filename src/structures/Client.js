const Discord = require("discord.js");
const Command = require("./Command.js");
const Event = require("./Event.js");
const PlayerEvent = require("./PlayerEvent.js");
const DMP = require("discord-music-player");
const fs = require("fs");

class Client extends Discord.Client {
  constructor() {
    console.log("*** DISCORD JS BOT: INITIALIZATION ***");

    super({
      intents: new Discord.Intents(32767),
      allowedMentions: { repliedUser: false },
    });

    /**
     * @type {Discord.Collection<string, Command>}
     */
    this.commands = new Discord.Collection();

    this.config = require("../data/config.json"); //universal bot configs

    // Discord music player instance
    /**
     * @type {DMP.Player}
     */
    this.player = new DMP.Player(this, {
      leaveOnEmpty: false,
      deafenOnJoin: true,
    });

    console.log(`Loading ${this.config.name} v${this.config.version}`);
  }

  start(token) {
    //Register commands
    console.log("Commands:");
    this.commandTypes = [];
    fs.readdirSync("./src/commands").forEach((dir) => {
      //Register each folder of commands
      this.commandTypes.push(dir.toString().toLowerCase());
      console.log(`\t${dir}`);
      fs.readdirSync(`./src/commands/${dir}`)
        .filter((file) => file.endsWith(".js"))
        .forEach((file) => {
          /**
           * @type {Command}
           */
          const command = require(`../commands/${dir}/${file}`);
          command.type = dir.toString();
          this.commands.set(command.name, command);
          console.log(`\t\t${command.name}`);
        });
    });

    //Register discord events
    console.log("Events:");
    fs.readdirSync("./src/events")
      .filter((file) => file.endsWith(".js"))
      .forEach((file) => {
        /**
         * @type {Event}
         */
        const event = require(`../events/${file}`);
        this.on(event.name, event.runFunction.bind(null, this));
        console.log(`\t${event.name}`);
      });

    //Register discord music player events
    console.log("Player Events:");
    fs.readdirSync("./src/playerEvents")
      .filter((file) => file.endsWith(".js"))
      .forEach((file) => {
        /**
         * @type {PlayerEvent}
         */
        const playerEvent = require(`../playerEvents/${file}`);
        this.player.on(
          playerEvent.name,
          playerEvent.runFunction.bind(null, this)
        );
        console.log(`\t${playerEvent.name}`);
      });

    console.log("*** DISCORD JS BOT: INITIALIZATION DONE ***");

    this.login(token);
  }

  /**
   * Get the guild config data corresponding to guildId. If does not exist, generate based on defaults!
   * @typedef {{prefix: string, greetings: string[], maxMessagesCleared: Number, designatedMusicChannelIds: string[]}} GuildConfig
   * @param {string} guildId
   * @returns {GuildConfig}
   */
  getGuildConfig(guildId) {
    let guildConfigFileName = fs
      .readdirSync("./src/data/guilds")
      .filter((file) => file == `${guildId}.json`);

    switch (guildConfigFileName.length) {
      //Guild config file does not exist yet
      case 0: {
        console.log(
          "Guild config file not present. Generating one with the default values!"
        );

        guildConfigFileName = `${guildId}.json`;

        fs.copyFileSync(
          "./src/data/guilds/default.json",
          `./src/data/guilds/${guildConfigFileName}`
        );
      }
      case 1:
        return require(`../data/guilds/${guildConfigFileName}`);

      default:
        message.reply(
          "Found multiple config files for your server! Using default for now.\nAsk dev to check out this bug!"
        );

        return require(`../data/guilds/default.json`);
    }
  }
}

module.exports = Client;
