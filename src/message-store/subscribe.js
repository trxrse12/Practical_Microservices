const Bluebird = require('bluebird');
const {v4:uuid} = require('uuid');
const category = require('./category');
const {isObject} = require("../utils");
const lodashClonedeep = require('lodash.clonedeep');

const subscriberStreamName = subsId => `subscriberPosition-${subsId}`;

const ConfigureCreateSubscription = (function({subscriberStreamName}){
  let SubscribeFactory;
  let currentPosition = 0;

  // returns the constructor
  SubscribeFactory = function({read, readLastMessage, write}) {
    const subscribe = ({
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

      let messageSinceLastPositionWrite = 0;
      let keepGoing = true;

      function loadPosition() {
        return readLastMessage(subscriberStreamName(subscriberId))
          .then(message => {
            currentPosition = message ? message.data.position : 0
          })
      }

      function writePosition(position) {
        if (!position || isNaN(position)){
          throw new TypeError('writePosition(): invalid argument')
        }
        const positionEvent = {
          id: uuid(),
          type: 'Read',
          data: {position}
        };

        return write(subscriberStreamName(subscriberId), positionEvent);
      }

      function start() {
        async function poll() {
          await loadPosition();

          while (keepGoing) {
            const messagesProcessed = await tick();

            if (messagesProcessed === 0) {
              await Bluebird.delay(tickIntervalMs)
            }
          }
        }

        console.log(`Started ${subscriberId}`);

        return poll();
      }

      function stop() {
        console.log(`Stopped ${subscriberId}`);

        keepGoing = false;
      }

      function tick() {
        // retrieves the batches of messages in the category I'm subscribed to
        function getNextBatchOfMessages() {
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

          return read(streamName, currentPosition + 1, messagesPerTick)
            .then(filterOnOriginMatch);
        }

        function processBatch(messages) {
          function handleMessage(message) {
            const handler = handlers[message.type] || handlers.$any;

            return handler ? handler(message) : Promise.resolve(true);
          }

          function updateReadPosition(position) {
            if (!position || isNaN(position)){
              throw new TypeError('updateReadPosition(): wrong position argument: ' + position);
            }
            currentPosition = position;
            messageSinceLastPositionWrite += 1;

            if (messageSinceLastPositionWrite === positionUpdateInterval) {
              messageSinceLastPositionWrite = 0;

              return writePosition(position, write);
            }

            return Bluebird.resolve(true);
          }

          return Bluebird.each(messages, message =>
            handleMessage(message)
              .then(() => updateReadPosition(message.globalPosition))
              .catch(err => {
                function logError(lastMessage, error) {
                  console.error(
                    'error processing:\n',
                    `\t${subscriberId}\n`,
                    `\t${lastMessage.id}\n`,
                    `\t${error}\n`
                  )
                }

                logError(message, err);

                // re-throw error that we can break the chain
                throw err;
              })
          )
            .then(() => messages.length);
        }

        return getNextBatchOfMessages()
          .then(processBatch)
          .catch(err => {
            console.error('Error processing batch', err);
            stop();
          });
      }
      return {
        loadPosition,
        start,
        stop,
        tick: tick,
        writePosition,
      }
    } // end subscribe()
    return subscribe;
  } // end Subscribe
  return SubscribeFactory
}({subscriberStreamName}))

module.exports = ConfigureCreateSubscription;

