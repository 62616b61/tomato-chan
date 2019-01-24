exports.test = (event, callback) => {
  const pubsubMessage = event.data;
  console.log('test', Buffer.from(pubsubMessage.data, 'base64').toString());
  callback();
};
