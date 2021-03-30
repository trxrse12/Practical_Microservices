const createRead = require('./read');

const fakeDb = {
  query: () => jest.fn().mockResolvedValue(10),
};

describe('function createRead', () => {
  it('should return a read() function that has a read property', () => {
    const read = createRead(fakeDb);
    expect(read).toHaveProperty('read');
  });
  //
  // describe('internal read() ', () => {
  //   const read = createRead(fakeDb);
  //   const streamName= 'testStream';
  //   const fromPosition = 100;
  //   const maxMessages = 10000;
  //   const readResult = read.read(streamName, fromPosition, maxMessages);
  //   expect(readResult).resolves.toBe(10)
  // });
});

