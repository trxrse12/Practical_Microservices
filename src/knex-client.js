const Bluebird = require('bluebird');
const knex = require('knex');

function createKnexClient({connectionString, migrationsTableName}){
  console.log('UUUUUUUUUUUUUUUUUUUUUUUUUuu connectionString=', connectionString)
  const client = knex(connectionString);

  const migrationOptions = {
    tableName: migrationsTableName || 'knex-migrations'
  }

  // Wrap in Bluebird.resolve to guarantee a Bluebird Promise down the chain
  return Bluebird.resolve(client.migrate.latest(migrationOptions))
    .then(() => client);
}

module.exports = createKnexClient;