const deserializeMessage = require('./deserialize-message');

const getCategoryMessagesSql = 'SELECT * FROM get_category_messages($1, $2, $3)';
const getStreamMessagesSql = 'SELECT * FROM get_stream_messages($1, $2, $3)';

const getLastMessageSql = 'SELECT * FROM get_last_stream_message($1)';

function project(events, projection){
  return events.reduce((entity, event) => {
    if (!projection[event.type]){
      return entity;
    }

    return projection[event.type](entity, event)
  }, projection.$init())
}

function createRead ({db = {}} = {}){
  if (Object.keys(db).length===0 && db.constructor === Object){
    throw new Error("createRead() error: invalid db argument")
  }

  function fetch(streamName, projection){
    return read(streamName).then(messages => project(messages, projection))
  }

  function readLastMessage(streamName){
    return db.query(getLastMessageSql, [streamName])
      .then(res => deserializeMessage(res.rows[0]))
  }

  /**
   * Returns a promise that solves into a set of rows retrieved from the postgres database
   * @param streamName
   * @param fromPosition
   * @param maxMessages
   * @returns {*|Promise<T | never>|undefined}
   */
  function read(streamName, fromPosition = 0, maxMessages=1000) {
    let query = null;;
    let values = [];
    if (streamName.includes('-')){
      query = getStreamMessagesSql;
      values = [streamName, fromPosition, maxMessages];
    } else {
      query = getCategoryMessagesSql;
      values = [streamName, fromPosition, maxMessages];
    }

    return db.query(query,values)
      .then(res => {
        return res.rows.map(deserializeMessage)
      })
      .catch(err => {
        throw new Error('Error in the read message-db wrapper: ', err);
      });
  }
  return {
    read,
    readLastMessage,
    fetch,
  }
}

module.exports = exports = createRead;