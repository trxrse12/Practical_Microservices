const createDatabase = require('./postgres-client');
const {messageStoreConnectionString} = require('./env');

describe('function createDatabase internal query function', () => {
  it('should throw if null query', () => {
    expect(() => createDatabase(messageStoreConnectionString)
      .query('', [])).toThrow('message-db query cannot be null');
  });
});