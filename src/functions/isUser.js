/**
 * @param {string} userType
 * @param {string} userId
 * @returns {boolean}
 */
module.exports = (userType, userId) => {
  switch (userType) {
    case "dev": {
      require("dotenv").config({ path: "src/data/.env" });
      const devIds = process.env.DEV_IDS.split(", ");
      return devIds.filter((id) => id == userId).length == 1;
    }

    default:
      console.log("Functions/isUser.js: Ran but could not match userType!");
      break;
  }
  return false;
};
