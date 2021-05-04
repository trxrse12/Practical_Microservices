const Bluebird = require('bluebird');
const loadIdentity = require('./load-identity');
const ensureNotRegistered = require('./ensure-not-registered');
const renderRegistrationEmail = require('./render-registration-email');
const writeSendCommand = require('./write-send-command');
const writeRegisteredEvent = require('./write-registered-event');
const AlreadyRegisteredError = require('./already-registered-error');

const ensureRegistrationEmailNotSent =
  require('./ensure-registration-email-not-sent');


function createIdentityCommandHandlers({messageStore}){
  console.log('MMMMMMMMMMMMMMMMMMMMMMM messageStore=', messageStore);
  return {
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

  function start(){
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