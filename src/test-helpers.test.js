const fakeDb = require('./test-helpers');

describe('the fake database', () => {
  it('should have a query property', () => {
    expect(fakeDb).toEqual(expect.objectContaining({
      query: expect.anything(),
    }))
  });
  describe('and the query property', () => {
    it('should return a Promise', () => {
      return fakeDb.query()
        .then(value => expect(value).toEqual({"a":1}))
    });
  });
});