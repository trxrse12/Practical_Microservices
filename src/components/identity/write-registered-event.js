const uuid = require('uuid/v4')

async function writeRegisteredEvent(context, err){
  const command = context.command;
  const registeredEvent = {
    id: uuid(),
    type: 'Registered',
    metadata: {
      traceId: command.metadata.traceId,
      userId: command.metadata.userId,
    },
    data: {
      userId: command.data.userId,
      email: command.data.email,
      passwordHash: command.data.passwordHash,
    }
  };
  const identityStreamName = `identity-${command.data.userId}`;

  const writeResult = await context.messageStore
    .write(identityStreamName, registeredEvent)
    .then(() => context);
  return writeResult;
}

module.exports = writeRegisteredEvent;