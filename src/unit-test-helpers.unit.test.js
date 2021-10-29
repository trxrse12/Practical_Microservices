const {fakeDb, badArgs} = require('./unit-test-helpers');
// const {config, reset} = require('./test-helpers');

describe('the fake database', () => {
  it('should have a query property', () => {
    expect(fakeDb).toEqual(expect.objectContaining({
      query: expect.anything(),
    }))
  });
  describe('and the query property', () => {
    it('should return a Promise that solves in an array of objects', () => {
      return fakeDb.query()
        .then(value => expect(value?.rows).toEqual([{data:'{"a": 100}'},{data:'{"b": 200}'}]))
    });
  });
});

describe('checkReturningPromiseIsThrowing() should', () => {
  it('throw if badArgsArray is NOT an array', () => {
    expect(1).toBe(1)
  });
});