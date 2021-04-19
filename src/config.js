// Primitives
const createKnexClient = require('./knex-client');
const createPostGresClient = require('./postgres-client');
const createMessageStore = require('./message-store');

const createHomePageAggregator = require('./aggregators/home-page');
const createUserCredentialsAggregator =
  require('./aggregators/user-credentials');

const createRegisterUsersApp = require('./app/register-users');
const createHomeApp = require('./app/home');
const createRecordViewingsApp = require('./app/record-viewings');
const createIdentityComponent = require('./components/identity');

function createConfig ({env}) {
  const knexClient = createKnexClient({
    connectionString: env.databaseUrl
  });

  const postgresClient = createPostGresClient({
    connectionString: env.messageStoreConnectionString
  });

  const messageStore = createMessageStore({db: postgresClient});

  const homePageAggregator = createHomePageAggregator({
    db: knexClient,
    messageStore,
  });

  const userCredentialsAggregator = createUserCredentialsAggregator({
    db: knexClient,
    messageStore,
  })

  const identityComponent = createIdentityComponent({messageStore});

  const aggregators = [
    homePageAggregator,
    userCredentialsAggregator,
  ];

  const components = [
    identityComponent,
  ];

  const homeApp = createHomeApp({db: knexClient});
  const registerUsersApp = createRegisterUsersApp({
    db: knexClient,
    messageStore,
  });

  const recordViewingsApp = createRecordViewingsApp({messageStore});

  return {
    db: knexClient,
    // homeApp,
    recordViewingsApp,
    messageStore,
    homePageAggregator,
    aggregators,
    components,
    registerUsersApp,
  }
}

module.exports = createConfig;