exports.startPeriod = (event, callback) => {
  const pubsubMessage = event.data;

  console.log('INCOMING DATA', Buffer.from(pubsubMessage.data, 'base64').toString());

  callback();
};
