

const Bluebird = require('bluebird');
const { v4: uuid } = require('uuid');
const category = require('./category');
const { isObject } = require('../utils');

const ConfigureCreateSubscription = (function () {
  let Subscribe;
  let currentPosition = 0;

  // returns the constructor
  Subscribe = function ({ read, readLastMessage, write }) {
    return ({
      streamName,
      handlers,
      messagesPerTick = 100,
      subscriberId,
      positionUpdateInterval = 100,
      originStreamName = null,
      tickIntervalMs = 100,
    }) => {
      // Check for a min set of correct params:
      // TODO: Tech debt: refactor the lines below into separate validation class or function)
      // streamName: string
      if (!(typeof streamName === 'string')) {
        throw new TypeError(
          'createSubscription() error: incorrect parameters: streamName=',
          streamName
        );
      }
      // handlers is an object with keys that have functions as their values
      if (
        !isObject(handlers) ||
        (isObject(handlers) &&
          Object.values(handlers).filter(
            (v) =>
              typeof v === 'function' &&
              v.toString().match(/(,+){}/)?.length > 0
          )?.length > 0)
      ) {
        throw new TypeError(
          'createSubscription() error: incorrect parameters: handlers=',
          handlers
        );
      }
      // subscriberId should a string that contains : (e.g. aggregators:home-page)
      if (!(typeof subscriberId === 'string') || !subscriberId.match(/:/)) {
        throw new TypeError(
          `createSubscription() error: incorrect parameters: subscriberId=${subscriberId}`
        );
      }

      const subscriberStreamName = `subscriberPosition-${subscriberId}`;
      let messageSinceLastPositionWrite = 0;
      let keepGoing = true;

      const returnCurrentPosition = async (position) => async (message) => {
        position = message ? message.data.position : 0;
        return position;
      };

      // find the saved stream position for a subscription
      async function loadPosition() {
        return await readLastMessage(subscriberStreamName).then(() => {
          currentPosition = returnCurrentPosition(currentPosition);
        });
      }

      // saves the stream position for a subscription
      async function writePosition(position) {
        if (!position) {
          throw new TypeError('invalid argument');
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
        if (!message){
          throw new TypeError('hanldeMessage(): invalid message arg')
        }
        const handler = handlers[message.type] || handlers.$any;
        if (typeof handler !== 'function'){
          throw new TypeError('hanldeMessage(): invalid handler function')
        }
        try {
          const handlingResult = await handler(message);
          return handler ? handlingResult : Promise.resolve(true);
        } catch (err){
          return Promise.resolve(true); // does nothing if the message handler throws or rejects
        }
      }

      async function processBatch(messages) {
        if (!Array.isArray(messages) ||
          messages.filter(m => m?.id).length === 0
        ){
          throw new TypeError('processBatch(): invalid messages arg');
        }
        return Bluebird.each(messages, (message) => {
          const handledMessage = handleMessage(message)
            .then(async () => await updateReadPosition(message.globalPosition))
            .catch((err) => {
              logError(message, err);

              // re-throw error that we can break the chain
              throw err;
            });
        }).then(() => messages.length);
      }

      function logError(lastMessage, error) {
        console.error(
          'error processing:\n',
          `\t${subscriberId}\n`,
          `\t${lastMessage.id}\n`,
          `\t${error}\n`
        );
      }

      function filterOnOriginMatch(messages) {
        if (!originStreamName) {
          return messages;
        }

        return messages.filter((message) => {
          const originCategory =
            message.metadata && category(message.metadata.originStreamName);

          return originStreamName === originCategory;
        });
      }

      // retrieves the batches of messages in the category I'm subscribed to
      async function getNextBatchOfMessages() {
        const allRemainingMessagesAfterStreamBookmark = await read(
          streamName,
          currentPosition + 1,
          messagesPerTick
        );

        const filteredMessages = filterOnOriginMatch(
          allRemainingMessagesAfterStreamBookmark
        );
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
            await Bluebird.delay(tickIntervalMs);
          }
        }
      }

      async function tick() {
        console.log('EEEEEEEEEEEEEEEEEEEEEEEEEEE getNextBatchOfMessages=', getNextBatchOfMessages.toString())
        if (typeof getNextBatchOfMessages !== 'function') {
          throw new TypeError('invalid getNextBatchOfMessage');
        }
        return getNextBatchOfMessages()
          .then((res) => res)
          .then(processBatch)
          .catch((err) => {
            console.error('tick(): Error processing batch: ', err);
            stop();
          });
      }
      return {
        loadPosition,
        start,
        stop,
        tick,
        writePosition,
        __private__: {
          loadPosition,
          writePosition,
          updateReadPosition,
          handleMessage,
          processBatch,
          filterOnOriginMatch,
          getNextBatchOfMessages,
          start,
          stop,
          poll,
          tick,
        },
      };
    };
  }; // end subscribe

  return Subscribe;
})();

ConfigureCreateSubscription.prototype = {
  display: () => {},
};

module.exports = ConfigureCreateSubscription;
