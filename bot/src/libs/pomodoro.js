const { PubSub } = require('@google-cloud/pubsub');

const START_PERIOD_TOPIC = 'start-period';
const WORK_SESSION_DURATION = 30 * 1000; // 30 minutes
const BREAK_DURATION = 10 * 1000; // 10 minutes
const LONG_BREAK_DURATION = 20 * 60 * 1000; // 20 minutes
const SESSION_BEFORE_LONG_BREAK = 4;

const STATE = {
  IDLE: 0,
  SESSION_IN_PROGRESS: 1,
  SESSION_ENDED: 2,
  BREAK_IN_PROGRESS: 3,
  BREAK_ENDED: 3,
}

const pubsub = new PubSub();

let state = STATE.IDLE;
let session = 1;
let timer = null;

async function handleStartCommand(channel) {
  /*
   * If state is IDLE or BREAK_ENDED, then begin work session.
   */
  if (state === STATE.IDLE || state === STATE.BREAK_ENDED) {
    channel.send(`Starting work session #${session}!`)
    setWorkSessionTimer(() => {
      state = STATE.SESSION_ENDED;
      channel.send(`Work session #${session} has ended. Write "tomato start" to start break.`);
    });

    const data = JSON.stringify({
      type: 'session',
      channel: channel.id,
      duration: WORK_SESSION_DURATION,
    });
    const dataBuffer = Buffer.from(data);

    const messageId = await pubsub.topic(START_PERIOD_TOPIC).publish(dataBuffer);
    console.log(`Start session message ${messageId} published.`);
  }

  /*
   * If state is SESSION_ENDED, then begin break.
   */
  if (state === STATE.SESSION_ENDED) {
    session++;
    channel.send('Starting break!')
    setBreakTimer(() => {
      state = STATE.BREAK_ENDED;
      channel.send(`Break has ended. Write "tomato start" to start work session #${session}.`);
    });

    const data = JSON.stringify({
      type: 'break',
      channel: channel.id,
      duration: BREAK_DURATION,
    });
    const dataBuffer = Buffer.from(data);

    const messageId = await pubsub.topic(START_PERIOD_TOPIC).publish(dataBuffer);
    console.log(`Start break message ${messageId} published.`);
  }
}

function setWorkSessionTimer(callback) {
  state = STATE.SESSION_IN_PROGRESS;
  timer = setTimeout(callback, WORK_SESSION_DURATION);
}

function setBreakTimer(callback) {
  state = STATE.BREAK_IN_PROGRESS;
  timer = setTimeout(callback, BREAK_DURATION);
}

module.exports = {
  handleStartCommand,
}
