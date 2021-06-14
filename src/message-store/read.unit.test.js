// const deserializeMessage = require('./deserialize-message')
const createRead = require('./read');
const { fakeDb } = require('../unit-test-helpers');

const db = fakeDb;
const { badArgs } = require('../unit-test-helpers');

jest.mock('./deserialize-message', () => (v) => v);

let createdFunctions;
let read;
describe('the main factory', () => {
  beforeEach(() => {
    jest.spyOn(db, 'query');
    createdFunctions = createRead({ db });
    ({ read } = createdFunctions);
  });
  describe('function createRead', () => {
    it('should return a read() function that has a read property', () => {
      // const read = createRead({db});
      expect(createdFunctions).toHaveProperty('read');
    });
    it('should throw if db is not defined', () => {
      expect(() => createRead()).toThrow(
        'createRead() error: invalid db argument'
      );
    });
    describe('internal read() ', () => {
      it('should resolve in the value returned by the db', async () => {
        const streamName = 'testStream';
        const fromPosition = 100;
        const maxMessages = 10000;
        try{
          const readResult = await read(streamName, fromPosition, maxMessages);
          expect(readResult).toEqual([
            expect.objectContaining({data: { a: 100 }}),
            expect.objectContaining({data: { b: 200 }})
          ]);
        } catch (err){
          throw new Error(err?.message)
        }
      });
      it('should throw if error in deserializeMessage', () => {
        
      });
      it('should throw if streamName is invalid', () => {
        badArgs
          .filter((v) => typeof v !== 'string')
          .forEach((badArg) => {
            expect(() => read(badArg, 0, 1000)).toThrow(
              'read(): invalid stream name'
            );
          });
      });
      it('should throw if fromPosition arg is not a number', () => {
        expect(() => read('aaa', { a: 1 })).toThrow(
          'read(): invalid fromPosition argument'
        );
      });
    });
  });
});
