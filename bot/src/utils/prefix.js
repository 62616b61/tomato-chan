const PREFIX = 'tomato ';

function hasPrefix(string) {
  return string.startsWith(PREFIX);
}

function removePrefix(string) {
  return string.replace(PREFIX, '');
}

module.exports = {
  hasPrefix,
  removePrefix,
};
