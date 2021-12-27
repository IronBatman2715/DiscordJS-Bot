const { GuildMember, Permissions } = require("discord.js");

module.exports =
  /**
   * Check if a user passes some check. Currently implemented: permissions and user list
   *
   * Note: Permissions checks will automatically return true if the user has the ADMINISTRATOR permission!
   *
   * @typedef {{permissions?: Permissions, userIdList?: string[]}} UserCheckOptions
   * @param {GuildMember} member
   * @param {UserCheckOptions} options
   * @returns {boolean} Verdict
   */
  (member, options = {}) => {
    //console.log("member: ", member);
    //console.log("options: ", options);

    if (Object.keys.length > 0) {
      if (options.hasOwnProperty("permissions")) {
        if (!permissionsCheck(member, options.permissions)) {
          console.log("User does not have permission!");
          return false;
        }
      }

      if (options.hasOwnProperty("userIdList")) {
        if (!userIdListCheck(member.user.id, options.userIdList)) {
          console.log("User is not in specified user list!");
          return false;
        }
      }

      //console.log("Function/isUser: User passed all checks!");
      return true;
    }
    console.log("Function/isUser: No options specified, returning false!");
    return false;
  };

/**
 * @param {GuildMember} member
 * @param {Permissions} permissions
 * @returns {boolean}
 */
function permissionsCheck(member, permissions) {
  if (member.permissions.has(permissions, true)) {
    return true;
  } else {
    return false;
  }
}

/**
 * @param {string} memberId
 * @param {string[]} userIdList
 */
function userIdListCheck(memberId, userIdList) {
  if (userIdList.includes(memberId)) {
    return true;
  } else {
    return false;
  }
}
