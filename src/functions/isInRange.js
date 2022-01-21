module.exports =
  /**
   * @param {number} value
   * @param {number} min [default: 1]
   * @param {number} max [default: Number.MAX_SAFE_INTEGER]
   * @returns {boolean}
   */
  (value, min = 1, max = Number.MAX_SAFE_INTEGER) => {
    if (min > max) {
      return false;
    }
    if (min == max) {
      return value == min;
    }

    return min <= value && value <= max;
  };
