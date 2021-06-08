// @ts-check

import { knex, Knex } from 'knex';

const Bluebird = require('bluebird');

function createKnexClient(
  { connectionString, migrationsTableName }:
    { connectionString: string, migrationsTableName: string }): Promise<Knex.Client> {
  const client = knex(connectionString);

  const migrationOptions = {
    tableName: migrationsTableName || 'knex-migrations'
  };
  // Wrap in Bluebird.resolve to guarantee a Bluebird Promise down the chain
  return Bluebird.resolve(client.migrate.latest(migrationOptions))
    .then(() => client);
}

module.exports = createKnexClient;