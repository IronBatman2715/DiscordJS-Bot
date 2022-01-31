module.exports = (...entries) => {
  entries.forEach((entry) => {
    if (typeof entry !== "string") entry = entry.toString();

    process.stdout.write(entry);
  });
};
