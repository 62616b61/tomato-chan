const WORK_SESSION_DURATION = 30 * 1000; // 30 minutes
const BREAK_DURATION = 10 * 1000; // 30 minutes
const LONG_BREAK_DURATION = 20 * 60 * 1000; // 30 minutes
const SESSION_BEFORE_LONG_BREAK = 4;

const STATE = {
  IDLE: 0,
  SESSION_IN_PROGRESS: 1,
  SESSION_ENDED: 2,
  BREAK_IN_PROGRESS: 3,
  BREAK_ENDED: 3,
}

let state = STATE.IDLE;
let session = 0;
let timer = null;

function handleStartCommand(channel) {
  /*
   * If state is IDLE or BREAK_ENDED, then begin work session.
   */
  if (state === STATE.IDLE || state === STATE.BREAK_ENDED) {
    channel.send('Starting work session!')
    setWorkSessionTimer(() => {
      state = STATE.SESSION_ENDED;
      channel.send('Work session has ended. Write "tomato start" to start break.');
    });
  }

  /*
   * If state is SESSION_ENDED, then begin break.
   */
  if (state === STATE.SESSION_ENDED) {
    channel.send('Starting break!')
    setBreakTimer(() => {
      state = STATE.BREAK_ENDED;
      channel.send('Break has ended. Write "tomato start" to start work session.');
    });
  }
}

function setWorkSessionTimer(callback) {
  session++;
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
