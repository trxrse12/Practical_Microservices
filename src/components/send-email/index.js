const createSend = require('./send');
const Bluebird = require('bluebird');

const loadEmail = require('./load-email');
const ensureEmailHasNotBeenSent =
  require('./ensure-email-has-not-been-sent');
const sendEmail = require('./send-email');
const writeSentEvent =
  require('./write-sent-event');

const AlreadySentError = require('./already-sent-error');
const SendError = require('./send-error');

function createHandlers ({
  justSendIt,
  messageStore,
  systemSenderEmailAddress,
}){
  return {
    Send: command => {
      const context = {
        messageStore,
        justSendIt,
        systemSenderEmailAddress,
        sendCommand: command,
      };

      return Bluebird.resolve(context)
        .then(loadEmail)
        .then(ensureEmailHasNotBeenSent)
        .then(sendEmail)
        .then(writeSentEvent)
        .catch(AlreadySentError, () => {}) // no-op
        .catch(
          SendError,
          err => writeFailedEvent(context, err)
        )
    }
  }
}

function build({
  messageStore,
  systemSenderEmailAddress,
  transport
}) {
  const justSendIt = createSend({transport});
  const handlers = createHandlers({
    messageStore,
    justSendIt,
    systemSenderEmailAddress
  });
  const subscription = messageStore.createSubscription({
    streamName: 'sendEmail:command',
    handlers,
    subscriberId: 'components:send-email'
  });

  function start(){
    subscription.start()
  }

  return {
    handlers,
    start
  }
}

module.exports = build;