/**
 * @typedef {{name: string, type: string, required: boolean, value: any, range: number[]}} ExtraArgumentOptions
 * @param {ExtraArgumentOptions} arg
 * @returns {boolean}
 */
module.exports = (arg) => {
  //Find correct type check from input type string
  switch (arg.type) {
    case "string":
      return true;

    case "number":
    case "float": {
      const num = Number(arg.value);
      if (!Number.isNaN(num)) {
        return isInRange(arg, num);
      }
      return false;
    }

    case "integer": {
      const num = Number(arg.value);
      if (Number.isInteger(num)) {
        return isInRange(arg, num);
      }
      return false;
    }

    case "any": {
      console.log(
        "Functions/isValidArg: Any type is valid specified. Must be checked in command itself!"
      );
      return true;
    }

    default:
      console.error(`Functions/isValidArg: Failed to match a type!`);
      return false;
  }
};

/**
 * @typedef {{name: string, type: string, required?: boolean, value: any, range: number[]}} ExtraArgumentOptions
 * @param {ExtraArgumentOptions} arg
 * @param {Number} num
 * @returns {boolean}
 */
function isInRange(arg, num) {
  if (arg.range.length == 2) {
    return arg.range[0] <= num && num <= arg.range[1];
  }

  console.log(`Range not set for ${arg.name} argument. Not checking`);
  return true;
}
