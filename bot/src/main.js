const { Client, Channel } = require('discord.js');
const { hasPrefix, removePrefix } = require('./utils/prefix');
const { handleStartCommand } = require('./libs/pomodoro');
const { version } = require('../package.json');

const TOKEN = process.env.TOKEN;

const client = new Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  const channel = client.channels.get('466128199592706061');
  channel.send(`I have been updated! My version is ${version} now.`)
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
