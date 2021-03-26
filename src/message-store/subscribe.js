const Bluebird = require('bluebird');
const uuid = require('uuid');
const category = require('./category');

function configureCreateSubscription({read, readLastMessage, write}){
  return ({
    streamName,
    handlers,
    messagesPerTick = 100,
    subscriberId,
    positionUpdateInterval = 100,
    tickIntervalMs = 100
  }) => {
    const subscriberStreamName = `subscriberPosition-${subscriberId}`;
    let currentPosition = 0;
    let messageSinceLastPositionWrite = 0;
    let keepGoing = true;

    function loadPosition () {
      return readLastMessage(subscriberStreamName)
        .then(message => {
          currentPosition = message ? message.data.position :0
        })
    }

    function writePosition(position) {
      const positionEvent = {
        id: uuid(),
        type: 'Read',
        data: {position}
      };

      return write(subscriberStreamName, positionEvent);
    }

    function updateReadPosition (position){
      currentPosition = position;
      messageSinceLastPositionWrite += 1;

      if (messageSinceLastPositionWrite === positionUpdateInterval){
        messageSinceLastPositionWrite = 0;

        return writePosition(position);
      };

      return Bluebird.resolve(true);
    }

    function handleMessage(message){
      const handler = handlers[message.type] || handlers.$any;

      return handler ? handler(message) : Promise.resolve(true);
    }

    function processBatch (messages){
      return Bluebird.each(messages, message =>
        handleMessage(message)
          .then(() => updateReadPosition(message.globalPosition))
          .catch(err => {
            logError(message, err);

            // re-throw error that we can break the chain
            throw err;
          })
      )
        .then(() => messages.length);
    }

    function logError(lastMessage, error){
      console.error(
        'error processing:\n',
        `\t${subscriberId}\n`,
        `\t${lastMessage.id}\n`,
        `\t${error}\n`
      )
    }

    function getNextBatchOfMessages (){
      return read(streamName, currentPosition + 1, messagesPerTick);
    }

    function start(){
      console.log(`Started ${subscriberId}`);

      return poll();
    }

    function stop(){
      console.log(`Stopped ${subscriberId}`);

      keepGoing = false;
    }

    async function poll () {
      await loadPosition();

      while (keepGoing) {
        const messagesProcessed = await tick();

        if (messagesProcessed === 0){
          await Bluebird.delay(tickIntervalMs)
        }
      }
    }

    function tick(){
      return getNextBatchOfMessages()
        .then(processBatch)
        .catch(err => {
          console.error('Error processing batch', err);
          stop();
        })
    }

    return {
      loadPosition,
      start,
      stop,
      tick,
      writePosition
    }
  }
}

module.exports = configureCreateSubscription;

