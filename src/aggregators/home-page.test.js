const buildHomePage = require('./home-page');
const {fakeDb, fakeMessageStore} = require('../test-helpers');
const db = fakeDb;
const messageStore = fakeMessageStore;
describe('buildHomePage()', () => {
  it('should return an object with certain props', () => {
    expect(buildHomePage({db, messageStore})).toMatchObject({
      queries: expect.any(Object),
      handlers: expect.any(Object),
      init: expect.any(Function),
      start: expect.any(Function),
    })
  });
});