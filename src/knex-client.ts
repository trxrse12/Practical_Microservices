// @ts-check
import { knex, Knex } from 'knex';

const Bluebird = require('bluebird');
// const knex: Knex.Client = require('knex');

function createKnexClient(config: { connectionString: string | Knex.Config<any>; migrationsTableName: any; }): Promise<Knex.Client> {
  const client = knex(config.connectionString);

  const migrationOptions = {
    tableName: config.migrationsTableName || 'knex-migrations',
  };
  // Wrap in Bluebird.resolve to guarantee a Bluebird Promise down the chain
  return Bluebird.resolve(client.migrate.latest(migrationOptions)).then(
    () => client
  );
}

module.exports = createKnexClient;
