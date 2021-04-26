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
const createAuthenticateApp = require('./app/authenticate');

const createIdentityComponent = require('./components/identity');

const createPickupTransport = require('nodemailer-pickup-transport');
const createSendEmailComponent = require('./components/send-email');

const createVideoPublishingComponent = require('./components/video-publishing');

const createCreatorsPortal = require('./app/creators-portal');


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
  });
  const aggregators = [
    homePageAggregator,
    userCredentialsAggregator,
  ];


  const identityComponent = createIdentityComponent({messageStore});
  const transport = createPickupTransport({directory: env.emailDirectory});
  const sendEmailComponent = createSendEmailComponent({
    messageStore,
    systemSenderEmailAddress: env.systemSenderEmailAddress,
    transport,
  });
  const videoPublishingComponent = createVideoPublishingComponent({ messageStore });
  const components = [
    identityComponent,
    sendEmailComponent,
    videoPublishingComponent,
  ];



  const homeApp = createHomeApp({db: knexClient});
  const registerUsersApp = createRegisterUsersApp({
    db: knexClient,
    messageStore,
  });
  const recordViewingsApp = createRecordViewingsApp({messageStore});
  const creatorsPortalApp = createCreatorsPortal({
    db: knexClient,
    messageStore});
  const authenticateApp = createAuthenticateApp({
    db: knexClient,
    messageStore,
  });

  return {
    db: knexClient,
    messageStore,

    homeApp,
    recordViewingsApp,
    registerUsersApp,
    authenticateApp,
    creatorsPortalApp,

    homePageAggregator,
    aggregators,

    components,
    identityComponent,
    sendEmailComponent,
    videoPublishingComponent,
  }
}

module.exports = createConfig;