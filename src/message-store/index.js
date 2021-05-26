const createWrite = require('./write');
const createRead = require('./read');
const ConfigureCreateSubscription = require('./subscribe');

function createMessageStore({db}){
  const write = createWrite({db});
  const read = createRead({db});

  const createSubscription = new ConfigureCreateSubscription({
    read: read.read,
    readLastMessage: read.readLastMessage,
    write: write
  });

  return {
    createSubscription,
    read: read.read,
    readLastMessage: read.readLastMessage,
    write: write,
    fetch: read.fetch,
    stop: db.stop,
  }
}

module.exports = createMessageStore;