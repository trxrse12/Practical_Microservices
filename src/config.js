// Primitives
const createKnexClient = require('./knex-client');
const createPostGresClient = require('./postgres-client');
const createMessageStore = require('./message-store');
const createHomePageAggregator = require('./aggregators/home-page');

const createHomeApp = require('./app/home');
const createRecordViewingsApp = require('./app/record-viewings');

function createConfig ({env}) {
  const knexClient = createKnexClient({
    connectionString: env.databaseUrl
  });

  const postgresClient = createPostGresClient({
    connectionString: env.messageStoreConnectionString
  });

  const messageStore = createMessageStore({db: postgresClient});
  // console.log('XXXXXXXXXXXXXXXXXXXXXXXXXX postgresClient=', postgresClient)

  const homePageAggregator = createHomePageAggregator({
    db: knexClient,
    messageStore,
  });

  const aggregators = [
    homePageAggregator,
  ];

  const components = [

  ];

  // const homeApp = createHomeApp({db: knexClient});

  const recordViewingsApp = createRecordViewingsApp({messageStore});

  return {
    db: knexClient,
    // homeApp,
    recordViewingsApp,
    messageStore,
    homePageAggregator,
    aggregators,
    components,
  }
}

module.exports = createConfig;