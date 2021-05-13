const {fakeDb, badArgs} = require('./test-helpers');

describe('the fake database', () => {
  it('should have a query property', () => {
    expect(fakeDb).toEqual(expect.objectContaining({
      query: expect.anything(),
    }))
  });
  describe('and the query property', () => {
    it('should return a Promise that solves in an array of objects', () => {
      return fakeDb.query()
        .then(value => expect(value?.rows).toEqual(expect.arrayContaining([{a:1},{b:2}])))
    });
  });
});

describe('checkReturningPromiseIsThrowing() should', () => {
  it('throw if badArgsArray is NOT an array', () => {
    expect()
  });
});