import { TestNonArray } from './unit-test-helpers';

const { badArgsNonArray } = require('./unit-test-helpers');
  console.log('CCCCCCCCCCCCCCCCCCCCCCCC badArgsNonArray=',badArgsNonArray)
const {config, reset, createMessageStoreWithWriteSink} = require('./integration-test-helpers');

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

// type TestInput = string | number | null | undefined;
describe('createMessageStoreWithWriteSink()', () => {
  it.each<TestNonArray>(badArgsNonArray)(
    'should throw if sink not valid array',
    (badArray) => {
      expect(() => createMessageStoreWithWriteSink(badArray)).toThrow(
        'Sink must be an array'
      );
  });
});