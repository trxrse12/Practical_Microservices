const {v4:uuid} = rquire('uuid');

function writeFailedEvent(context, err){
  const sendCommand = context.sendCommand;
  const streamName = `sendEmail-${sendCommand.data.emailId}`;
  const event = {
    id: uuid(),
    type: 'Failed',
    metadata: {
      originStreamName: sendCommand.metadata.originStreamName,
      traceid: sendCommand.metadata.traceId,
      userId: sendCommand.metadata.userid,
    },
    data: {
      ...sendCommand.data,
      reason: err.message,
    }
  };

  return context.messageStore.write(streamName, event)
    .then(() => context);
}

module.exports = writeFailedEvent;