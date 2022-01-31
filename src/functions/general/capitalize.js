module.exports =
  /**
   * @param {string} str
   * @returns {string}
   */
  (str) => {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  };
