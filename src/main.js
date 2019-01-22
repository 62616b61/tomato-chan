const Discord = require('discord.js');
const config = require('./config.json');
const { hasPrefix, removePrefix } = require('./utils/prefix');

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (message) => {
  const { content, channel } = message;

  if (!hasPrefix(content)) return;

  const command = removePrefix(content);

  if (command === 'ping') {
    channel.send('Pong.');
  }

  if (command === 'bye') {
    channel.send('Bye-bye!');
  }
});

client.login(config.token);
