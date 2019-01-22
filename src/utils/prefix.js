const { prefix } = require('../config.json');

function hasPrefix(string) {
  return string.startsWith(prefix);
}

function removePrefix(string) {
  return string.replace(prefix, '');
}

module.exports = {
  hasPrefix,
  removePrefix,
};
