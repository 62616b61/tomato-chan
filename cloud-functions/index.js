const Scheduler = require('@google-cloud/scheduler');

const SCHEDULER_LOCATION = 'europe-west3';
const PERIOD_ENDED_TOPIC = 'projects/tomato-chan/topics/period-ended';

exports.startPeriod = (event, callback) => {
  const pubsubMessageRaw = event.data;
  const pubsubMessage = Buffer.from(pubsubMessageRaw.data, 'base64').toString();
  const { type, date, duration, channel } = JSON.parse(pubsubMessage);

  const startDate = new Date(date);
  const endDate = new Date(startDate.getTime() + duration * 60 * 1000);

  console.log('Date', date)
  console.log('Start date', startDate.toISOString())
  console.log('End date', endDate.toISOString())

  const scheduler = new Scheduler.v1beta1.CloudSchedulerClient();
  
  const formattedParent = scheduler.locationPath(process.env.GCLOUD_PROJECT, SCHEDULER_LOCATION);
  const formattedName = scheduler.jobPath(process.env.GCLOUD_PROJECT, SCHEDULER_LOCATION, `tomato-channel-${channel}-${duration}`);
  const schedule = `${endDate.getMinutes()} ${endDate.getHours()} * * *`;

  console.log('FORMATTED PARENT', formattedParent)
  console.log('FORMATTED NAME', formattedName)
  console.log('SCHEDULE', schedule)

  const dataBuffer = Buffer.from(JSON.stringify({
    type,
    channel,
    job: formattedName,
  })).toString('base64');

  const job = {
    name: formattedName,
    schedule,
    pubsubTarget: {
      topic: PERIOD_ENDED_TOPIC,
      data: 'kek',
    },
  };
  const request = {
    parent: formattedParent,
    job: job,
  };

  console.log('submitting scheudle job')

  scheduler.createJob(request)
    .then(responses => {
      const response = responses[0];

      console.log('SCHEUDLE', response);

      callback();
    })
    .catch(err => {
      console.log('error')
      console.error(err);
      callback();
    });
};

exports.periodEnded = (event, callback) => {
  const pubsubMessageRaw = event.data;
  const pubsubMessage = Buffer.from(pubsubMessageRaw.data, 'base64').toString();

  console.log('INCOMING DATA', pubsubMessage);

  callback();
}
