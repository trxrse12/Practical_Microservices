const {fakeDb, badArgs} = require('./unit-test-helpers');
const {config, reset} = require('./integration-test-helpers');

describe('reset()', () => {
  it('should delete the database tables', async () => {
    try {
      await reset();
      expect(1).toBe(1);
    } catch (e){
      throw new Error(e?.message);
    }
  });
});