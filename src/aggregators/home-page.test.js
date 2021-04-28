const buildHomePage = require('./home-page');
const {fakeDb, fakeMessageStore} = require('../test-helpers');
const db = fakeDb;
const messageStore = fakeMessageStore;
const {badArgs} = require('../test-helpers');

describe('buildHomePage()', () => {
  it('should return an object with certain props', () => {
    expect(buildHomePage({db, messageStore})).toMatchObject({
      queries: expect.any(Object),
      handlers: expect.any(Object),
      init: expect.any(Function),
      start: expect.any(Function),
    })
  });
  describe('and the queries object', () => {
    let queries;
    beforeEach(() => {
      ({queries} = buildHomePage({db, messageStore}));
    });
    it('should contain two functions', () => {
      expect(queries).toMatchObject({
        ensureHomePage: expect.any(Function),
        incrementVideosWatched: expect.any(Function),
      });
    });
    describe('and the incrementVideosWatched() should', () => {
      let incrementVideosWatched;
      beforeEach(() => {
        ({incrementVideosWatched} = queries);
      });
      it.each(badArgs)('throw if invalid %p parameter', (badArg) => {
        try {
          incrementVideosWatched(badArg)
        } catch (e) {
          expect(e?.message).toMatch('Invalid global position');
        }
      });

    });
  });
});