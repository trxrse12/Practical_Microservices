const configureCreateSubscription = require('./subscribe');

const read = () => Promise.resolve({a:1});
const readLastMessage = () => Promise.resolve({b:1});
const write = () => Promise.resolve({c:1});

describe('configureCreateSubscription() should', () => {
  it('return a function ', () => {
    // expect(configureCreateSubscription({read, readLastMessage, write})).toBe(Function)
  });
});