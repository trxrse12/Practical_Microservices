const Bluebird = require('bluebird');
const pg = require('pg');

function createDatabase({connectionString}) {
  const client = new pg.Client({connectionString, Promise:Bluebird});

  let connectedClient = null;

  function connect(){
    if (!connectedClient){
      connectedClient = client.connect()
        .then(() => client.query('SET search_path = message_store, public'))
        .then(() => client)
        .catch((err) => {
          throw new Error('message_store database doesn\'t exist')
        })
    }

    return connectedClient
  }

  function query (sql, values = []){
    if (!sql || sql.toString().length===0){
      throw new Error('message-db query cannot be null')
    }

    return connect()
      .then(client => client.query(sql, values))
  }

  return {
    query,
    stop: () => client.end()
  }
}

module.exports = createDatabase;

