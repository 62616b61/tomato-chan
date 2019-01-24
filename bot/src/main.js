const Discord = require('discord.js');
const { hasPrefix, removePrefix } = require('./utils/prefix');
const { handleStartCommand } = require('./libs/pomodoro');
const { version } = require('../package.json');

const TOKEN = process.env.TOKEN;

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (message) => {
  const { content, channel } = message;

  if (!hasPrefix(content)) return;

  const command = removePrefix(content);

  if (command === 'start') {
    await handleStartCommand(channel);
  }

  if (command === 'ping') {
    channel.send('Pong.');
  }

  if (command === 'version') {
    channel.send(`Current version: ${version}`);
  }

  if (command === 'hi') {
    channel.send('Hi-ya~');
  }

  if (command === 'bye') {
    channel.send('Bye-bye!');
  }
});

client.login(TOKEN);
