const fakeDb = {
  query: (...[streamName, fromPosition, maxMessages]) => Promise.resolve({a:1}),
};

module.exports = fakeDb;