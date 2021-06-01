const Bluebird = require('bluebird');
const {v4:uuid} = require('uuid');
const category = require('./category');
const {isObject} = require("../utils");
const lodashClonedeep = require('lodash.clonedeep');

const ConfigureCreateSubscription = (function(){
  let Subscribe;
  let currentPosition = 0;

  // returns the constructor
  Subscribe = function({read, readLastMessage, write}) {
    return ({
      streamName,
      handlers,
      messagesPerTick = 100,
      subscriberId,
      positionUpdateInterval = 100,
      originStreamName = null,
      tickIntervalMs = 100
    }) => {
      // Check for a min set of correct params:
      // TODO: Tech debt: refactor the lines below into separate validation class or function)
      // streamName: string
      if (!(typeof streamName === 'string')) {
        throw new TypeError('createSubscription() error: incorrect parameters: streamName=', streamName);
      }
      // handlers is an object with keys that have functions as their values
      if (!isObject(handlers) ||
        (isObject(handlers)
          && Object.values(handlers).filter(v => {
            return (typeof v === 'function') && v.toString().match(/(,+){}/)?.length > 0
          })?.length > 0
        )
      ) {
        throw new TypeError('createSubscription() error: incorrect parameters: handlers=', handlers)
      }
      // subscriberId should a string that contains : (e.g. aggregators:home-page)
      if (!(typeof subscriberId === 'string') || !subscriberId.match(/:/)) {
        throw new TypeError('createSubscription() error: incorrect parameters: subscriberId=' + subscriberId)
      }


      const subscriberStreamName = `subscriberPosition-${subscriberId}`;
      let messageSinceLastPositionWrite = 0;
      let keepGoing = true;

      // find the saved stream position for a subscription
      async function loadPosition() {
        return await readLastMessage(subscriberStreamName)
          .then(message => {
            currentPosition = message ? message.data.position : 0;
            return currentPosition;
          })
      }

      // saves the stream position for a subscription
      async function writePosition(position) {
        if (!position){
          throw new TypeError('invalid argument')
        }
        const positionEvent = {
          id: uuid(),
          type: 'Read',
          data: { position },
        };

        return await write(subscriberStreamName, positionEvent);
      }

      async function updateReadPosition(position) {
        currentPosition = position;
        messageSinceLastPositionWrite += 1;

        if (messageSinceLastPositionWrite === positionUpdateInterval) {
          messageSinceLastPositionWrite = 0;

          return await writePosition(position, write);
        }

        return Bluebird.resolve(true);
      }

      async function handleMessage(message) {
        const handler = handlers[message.type] || handlers.$any;

        const handlingResult = await handler(message);
        return handler ? handlingResult : Promise.resolve(true);
      }

      async function processBatch(messages) {
        return await Bluebird.each(messages, message => {
          const handledMessage = handleMessage(message)
            .then(async () => await updateReadPosition(message.globalPosition))
            .catch(err => {
              logError(message, err);

              // re-throw error that we can break the chain
              throw err;
            })
        }

        )
          .then(() => messages.length);
      }

      function logError(lastMessage, error) {
        console.error(
          'error processing:\n',
          `\t${subscriberId}\n`,
          `\t${lastMessage.id}\n`,
          `\t${error}\n`
        )
      }

      function filterOnOriginMatch(messages) {
        if (!originStreamName) {
          return messages;
        }

        return messages.filter(message => {
          const originCategory =
            message.metadata && category(message.metadata.originStreamName);

          return originStreamName === originCategory;
        })
      }

      // retrieves the batches of messages in the category I'm subscribed to
      async function getNextBatchOfMessages() {
        const allRemainingMessagesAfterStreamBookmark =
          await read(streamName, currentPosition + 1, messagesPerTick);

        const filteredMessages =
          filterOnOriginMatch(allRemainingMessagesAfterStreamBookmark);
        return filteredMessages;
        // return read(streamName, currentPosition + 1, messagesPerTick)
        //   .then(filterOnOriginMatch);
      }

      function start() {
        console.log(`Started ${subscriberId}`);

        return poll();
      }

      function stop() {
        console.log(`Stopped ${subscriberId}`);

        keepGoing = false;
      }

      async function poll() {
        await loadPosition();

        while (keepGoing) {
          const messagesProcessed = await tick();

          if (messagesProcessed === 0) {
            await Bluebird.delay(tickIntervalMs)
          }
        }
      }

      async function tick() {
        return await getNextBatchOfMessages()
          .then(res => {
            return res;
          })
          .then(processBatch)
          .catch(err => {
            console.error('Error processing batch', err);
            stop();
          });
      }
      const internalSubscribe =
        lodashClonedeep(Subscribe.prototype.writePosition);
      return {
        loadPosition,
        start,
        stop,
        tick,
        writePosition,
      }
    }
  } // end subscribe

  return Subscribe
}())

ConfigureCreateSubscription.prototype = {
  display: () => {}
}

module.exports = ConfigureCreateSubscription;

