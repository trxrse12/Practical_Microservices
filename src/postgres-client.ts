// @ts-check

import { Client } from 'pg';

const Bluebird = require('bluebird');
const pg = require('pg');

function createDatabase({ connectionString }: { connectionString: string }) {
  const client = new pg.Client({ connectionString, Promise: Bluebird });

  let connectedClient: Promise<Client> | null = null;

  function connect(): Promise<Client> {
    if (!connectedClient) {
      connectedClient = client
        .connect()
        .then(() => client.query('SET search_path = message_store, public'))
        .then(() => client)
        .catch((err: unknown) => {
          throw new Error(`message_store database doesn't exist.${err}`);
        });
    }
    if (connectedClient) {
      return connectedClient;
    }
    throw new Error('Something went wrong in setting up the Postgres client');
  }

  async function query(sql: string, values = []) {
    if (!sql || sql.toString().length === 0) {
      throw new Error('message-db query cannot be null');
    }
    const currentConnectedClient: Promise<Client> = connect();
    if (!currentConnectedClient) {
      throw new Error('Invalid Postgres client');
    } else {
      // eslint-disable-next-line no-shadow
      return currentConnectedClient.then((client) => client.query(sql, values));
    }
  }

  return {
    query,
    stop: () => client.end(),
  };
}

module.exports = createDatabase;
