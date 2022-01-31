/**
 * @param {string} SNAKE_CASE
 * @returns {string} Display
 */
module.exports = (SNAKE_CASE) => {
  return (
    SNAKE_CASE[0].toUpperCase() +
    SNAKE_CASE.slice(1).toLowerCase().replace(/_/g, " ")
  );
};
