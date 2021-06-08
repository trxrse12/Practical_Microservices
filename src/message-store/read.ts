// @ts-check
// eslint-disable-next-line import/extensions
import { knex, Knex } from 'knex';
import { IDomainEvents, IProjection } from './types';

const deserializeMessage = require('./deserialize-message');

const getCategoryMessagesSql =
  'SELECT * FROM get_category_messages($1, $2, $3)';
const getStreamMessagesSql = 'SELECT * FROM get_stream_messages($1, $2, $3)';

const getLastMessageSql = 'SELECT * FROM get_last_stream_message($1)';
const getAllMessagesSql = `
  SELECT 
    id::varchar,
    stream_name::varchar,
    type::varchar,
    position::bigint,
    global_position::bigint,
    data::varchar,
    metadata::varchar,
    time::timestamp
  FROM
    messages
  WHERE
    global_position > $1 
  LIMIT $2`;

function project(events: IDomainEvents, projection: IProjection) {
  return events.reduce((entity, event) => {
    if (!projection[event.type]) {
      return entity;
    }

    return projection[event.type](entity, event);
  }, projection.$init());
}

interface dbKnexClient {
  db: Knex.Client,
}

function createRead({ db }: dbKnexClient = {} as unknown as dbKnexClient) {
  if (!db || Object.keys(db).length === 0 && db.constructor === Object) { // test for empty object
    throw new Error('createRead() error: invalid db argument');
  }

  function readLastMessage(streamName: string) {
    return db
      .query(getLastMessageSql, [streamName])
      .then((res: { rows: any[] }) => deserializeMessage(res.rows[0]));
  }

  /**
   * Returns a promise that solves into a set of rows retrieved from the postgres database
   * @param streamName
   * @param fromPosition
   * @param maxMessages
   * @returns {*|Promise<T | never>|undefined}
   */
  function read(streamName: string, fromPosition = 0, maxMessages = 1000) {
    if (typeof streamName !== 'string') {
      throw new TypeError('read(): invalid stream name');
    }
    if (typeof fromPosition !== 'number' || Number.isNaN(fromPosition)) {
      throw new TypeError(
        `read(): invalid fromPosition argument: ${fromPosition}`
      );
    }
    let query = null;
    let values = [];
    if (streamName === '$all') {
      query = getAllMessagesSql;
      values = [fromPosition, maxMessages];
    } else if (streamName.includes('-')) {
      query = getStreamMessagesSql;
      values = [streamName, fromPosition, maxMessages];
    } else {
      query = getCategoryMessagesSql;
      values = [streamName, fromPosition, maxMessages];
    }
    return db
      .query(query, values)
      .then((res: { rows: any[] }) => {
        return res.rows.map(deserializeMessage)
      })
      .catch((err: unknown) => {
        throw new Error(`Error in the read message-db wrapper: ${err}`);
      });
  }

  /**
   * @description Fetches an entity from the store by loading the messages for
   * the given `streamName` and running them through the given `projection`.
   * @param {string} streamName The name of the stream to fetch
   * @param {Object} projection The projection to run it through
   * @param {Object} projection.$init Starting state for the projection
   */
  function fetch(streamName: string, projection: IProjection) {
    return read(streamName).then((messages: IDomainEvents) =>
      project(messages, projection)
    );
  }

  return {
    read,
    readLastMessage,
    fetch,
  };
};



// eslint-disable-next-line no-multi-assign
module.exports = exports = createRead;
