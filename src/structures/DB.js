const mongoose = require("mongoose");
const GuildConfigModel = require("../resources/data/mongoModels/GuildConfig.js");

module.exports = class DB {
  constructor() {
    mongoose.connect(process.env.DB_TOKEN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  /**
   * Get the guild config data corresponding to guildId. If does not exist, generate based on defaults!
   * @typedef {{guildId: string, greetings: string[], maxMessagesCleared: Number, musicChannel: string, defaultRepeatMode: number}} GuildConfig
   * @param {string} guildId
   * @returns {Promise<GuildConfig>}
   */
  async getGuildConfig(guildId) {
    try {
      const guildConfigSearch = await GuildConfigModel.find({
        guildId,
      });

      switch (guildConfigSearch.length) {
        //Guild config document does not exist yet
        case 0: {
          console.log("Guild config document not present. Generating one with the default values!");

          //Create new
          const guildConfigDefault = new GuildConfigModel({
            guildId,
          });

          //Save to DB
          const guildConfigNew = await guildConfigDefault.save();

          console.log("New document matching current guildId: ", guildConfigNew);
          return guildConfigNew.toObject();
        }
        case 1: {
          return guildConfigSearch[0].toObject();
        }

        default: {
          console.log(`Found multiple config documents for a server [guilId: ${guildId}]!`);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Update the guild config document corresponding to guildId with the data in guildConfig.
   * @typedef {{guildId: string, greetings: string[], maxMessagesCleared: Number, musicChannel: string, defaultRepeatMode: number}} GuildConfig
   * @param {string} guildId
   * @param {Partial<GuildConfig>} guildConfig
   * @returns {Promise<GuildConfig>}
   */
  async updateGuildConfig(guildId, guildConfig) {
    return await GuildConfigModel.updateOne({ guildId }, guildConfig).catch((error) =>
      console.error(error)
    );
  }

  /**
   * Delete the guild config document corresponding to guildId.
   * @param {string} guildId
   */
  async deleteGuildConfig(guildId) {
    return await GuildConfigModel.deleteOne({ guildId }).catch((error) => console.error(error));
  }
};
