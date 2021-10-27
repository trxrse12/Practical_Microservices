const Bluebird = require('bluebird');

// @ts-ignore
const events = require('../../example-messages/commands.json');
const createConfig = require('../config');
const env = require('../env');

const config = createConfig({ env })

Bluebird.each(events, event =>
  config.messageStore.write(event.streamName, event.event)
)
  .then(() => {
    console.log('Postgres db populated with test data!!!');
  })
  .finally(() => config.db
    .then(client => client.destroy())
    .then(config.messageStore.stop)
  );
