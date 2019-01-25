exports.startPeriod = (event, callback) => {
  const pubsubMessageRaw = event.data;
  const pubsubMessage = Buffer.from(pubsubMessage.data, 'base64').toString();
  const { type, date, duration } = JSON.parse(pubsubMessage);

  console.log('INCOMING DATA', pubsubMessage);

  const startDate = new Date(date);
  const endDate = new Date(startDate.getTime() + duration);

  console.log('Date', date)
  console.log('Start date', startDate.toISOString())
  console.log('End date', endDate.toISOString())

  callback();
};
