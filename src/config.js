const createKnexClient = require('./knex-client');
const createHomeApp = require('./app/home');

function createConfig ({env}) {
  console.log('EEEEEEEEEEEEEEEEEEEEEEEEE env=', env)
  const db = createKnexClient({
    connectionString: env.databaseUrl
  });
  const homeApp = createHomeApp({db})
  return {
    db,
    homeApp,
  }
}

module.exports = createConfig;