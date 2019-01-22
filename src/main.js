const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  console.log('msg', msg)
  console.log(msg.content, msg.content === '?ping')
  if (msg.content === '?ping') {
    msg.channel.send('Pong.');
  }

  if (msg.content === '?bye') {
    msg.channel.send('Bye-bye!');
  }
});

client.login(config.token);
