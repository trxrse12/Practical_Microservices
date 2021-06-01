const Bluebird = require('bluebird');
const loadIdentity = require('./load-identity');
const ensureNotRegistered = require('./ensure-not-registered');
const renderRegistrationEmail = require('./render-registration-email');
const writeSendCommand = require('./write-send-command');
const writeRegisteredEvent = require('./write-registered-event');
const writeRegistrationEmailSentEvent = require('./write-registration-email-sent-event');
const AlreadyRegisteredError = require('./already-registered-error');
const AlreadySentRegistrationEmailError = require('./already-sent-registration-email-error')

const ensureRegistrationEmailNotSent =
  require('./ensure-registration-email-not-sent');

function streamNameToId (streamName) {
  return streamName.split(/-(.+)/)[1]
}

function createIdentityCommandHandlers({messageStore}){
  return {
    // the first handler >>> creates an event and writes it to the message-store
    Register: command => {
      const context = {
        messageStore: messageStore,
        command,
        identityId: command.data.userId,
      };

      return Bluebird.resolve(context)
        .then(loadIdentity)
        .then(ensureNotRegistered)
        .then(writeRegisteredEvent)
        .catch(AlreadyRegisteredError, () => {}); // no-op
    },
  }
}

function createIdentityEventHandlers({messageStore}){
  return {
    // the second handler >>> creates a Register command and writes it to the message-store
    Registered: event => {
      const context = {
        messageStore: messageStore,
        event,
        identityId: event.data.userId,
      };

      return Bluebird.resolve(context)
        .then(loadIdentity)
        .then(ensureRegistrationEmailNotSent)
        .then(renderRegistrationEmail)
        .then(writeSendCommand)
        .catch(AlreadySentRegistrationEmailError, () => {})
    }
  }
}

function createSendEmailEventHandlers({messageStore}){
  return {
    // the third handler >>> creates an RegistrationEmailSent event and writes it to the message-store
    Sent: event => {
      const originStreamName = event.metadata.originStreamName;
      const identityId = streamNameToId(originStreamName);

      const context = {
        messageStore,
        event,
        identityId,
      };
      return Bluebird.resolve(context)
        .then(loadIdentity)
        .then(ensureRegistrationEmailNotSent)
        .then(writeRegistrationEmailSentEvent)
        .catch(AlreadySentRegistrationEmailError, () => {})
    }
  }
}


function build({messageStore}){
  const identityCommandHandlers = createIdentityCommandHandlers({messageStore});
  const identityCommandSubscription = messageStore.createSubscription({
    streamName: 'identity:command',
    handlers: identityCommandHandlers,
    subscriberId: 'components:identity:command'
  });

  const identityEventHandlers = createIdentityEventHandlers({messageStore});
  const identityEventSubscription = messageStore.createSubscription({
    streamName: 'identity',
    handlers: identityEventHandlers,
    subscriberId: 'components:identity'
  });

  const sendEmailEventHandlers = createSendEmailEventHandlers({messageStore});
  const sendEmailEventSubscription = messageStore.createSubscription({
    streamName:'sendEmail',
    handlers: sendEmailEventHandlers,
    originStreamName: 'identity',
    subscriberId: 'components:identity:sendEmailEvents',
  });

  function start(){ // start spinning the wheels of your engine
    identityCommandSubscription.start();
    identityEventSubscription.start();
    sendEmailEventSubscription.start();
  }

  return {
    identityCommandHandlers,
    identityEventHandlers,
    sendEmailEventHandlers,
    start,
  }
}

module.exports = build;