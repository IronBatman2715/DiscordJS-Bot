module.exports =
  /**
   * @param {string} str
   * @returns {string}
   */
  (str) => {
    return this.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  };
