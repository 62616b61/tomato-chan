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
  const jobName = `${channel}-${duration}`;
  const schedule = `${endDate.getMinutes()} ${endDate.getHours()} * * *`;

  const job = {
    name: jobName,
    schedule,
    pubsubTarget: {
      topic: PERIOD_ENDED_TOPIC,
      data: JSON.stringify({
        type,
        channel,
        job: jobName,
      }),
    },
  };
  const request = {
    parent: formattedParent,
    job: job,
  };

  client.createJob(request)
    .then(responses => {
      const response = responses[0];

      console.log('SCHEUDLE', response);

      callback();
    })
    .catch(err => {
      console.error(err);
    });
};

exports.periodEnded = (event, callback) => {
  const pubsubMessageRaw = event.data;
  const pubsubMessage = Buffer.from(pubsubMessageRaw.data, 'base64').toString();

  console.log('INCOMING DATA', pubsubMessage);

  callback();
}
