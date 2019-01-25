exports.startPeriod = (event, callback) => {
  const pubsubMessageRaw = event.data;
  const pubsubMessage = Buffer.from(pubsubMessageRaw.data, 'base64').toString();
  const { type, date, duration } = JSON.parse(pubsubMessage);

  console.log('INCOMING DATA', pubsubMessage);

  const startDate = new Date(date);
  const endDate = new Date(startDate.getTime() + duration * 60 * 1000);

  console.log('Date', date)
  console.log('Start date', startDate.toISOString())
  console.log('End date', endDate.toISOString())

  callback();
};
