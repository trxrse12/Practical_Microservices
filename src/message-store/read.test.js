
const createRead = require('./read');
const db = require('../test-helpers');

jest.mock('./deserialize-message',() => () => {a:1});

describe.skip('function createRead', () => {
  it('should return a read() function that has a read property', () => {
    const read = createRead({db});
    expect(read).toHaveProperty('read');
  });
  it('should throw if db is not defined', () => {
    expect(() => createRead()).toThrow("createRead() error: invalid db argument")
  });
  describe.skip('internal read() ', () => {
    it('should resolve in the value returned by the db', async () => {
      const read = createRead({db});
      const streamName= 'testStream';
      const fromPosition = 100;
      const maxMessages = 10000;
      const readResult = await read.read(streamName, fromPosition, maxMessages);
      expect(readResult).toBe({a:1})
    });
  });
});

