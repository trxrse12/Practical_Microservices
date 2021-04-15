const Bluebird = require('bluebird');

function createIdentityCommandHandlers({messageStore}){
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

  function start(){
    identityCommandSubscription.start()
  }

  return {
    identityCommandHandlers,
    start,
  }
}

module.exports = build;