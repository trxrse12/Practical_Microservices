const configureCreateSubscription = require('./subscribe');
const {badArgs} = require('../test-helpers');

const read = () => Promise.resolve({a:1});
const readLastMessage = () => Promise.resolve({b:1});
const write = () => Promise.resolve({c:1});

describe('configureCreateSubscription() should', () => {
  it('return a function ', () => {
    expect(configureCreateSubscription({read, readLastMessage, write})).toBeInstanceOf(Function)
  });
  describe('and the returned createSubscription() should', () => {
    let createSubscriptionFcn;
    beforeEach(() => {
      createSubscriptionFcn = configureCreateSubscription({read, readLastMessage, write});
    });
    it('throw if it gets an empty set config object', () => {
      try {
        createSubscriptionFcn({});
        throw new Error('It should not get to this point')
      } catch(e) {
        expect(e.message).toMatch('createSubscription() error: incorrect parameters')
      }
    });
    it.each(badArgs)('by getting throws if doesn\'t get a min set of params', (badArg) => {
      const streamName = badArg;
      try{
        createSubscriptionFcn(streamName)
        throw new Error('It should not get to this point');
      } catch (e){
        expect(e.message).toBeTruthy();
      }
    });
    it.each(badArgs)('throw if handlers is not an object that has non-empty functions as keys', (badArg) => {
      const streamName = 'identity:trxrse1-100010010';
      const handlers = badArg;
      try{
        createSubscriptionFcn({streamName, handlers});
        throw new Error('It should not get to this point: handlers=');
      } catch (e){
        expect(e.message).toBeTruthy();
      }
    });
    it.each(badArgs)('throw if subscriberId is not a valid string that contains :', (badArg) => {
      const streamName = 'identity:trxrse1-100010010';
      const handlers ={ VideoViewed: () => {return 100} };
      try{
        const subscriberId = badArg;
        createSubscriptionFcn({streamName, handlers, subscriberId});
        throw new Error('It should not get to this point: subscriberId=',subscriberId);
      } catch (e){
        expect(e.message).toMatch('createSubscription() error: incorrect parameters: subscriberId=');
      }
    });
    it('should return a valid function if the min set params is OK', () => {
      const streamName = 'identity:trxrse1-100010010';
      const handlers ={ VideoViewed: () => {return 100} };
      const subscriberId = 'gigi:identity';
      try{
        // console.log('KKKKKKKKKKKKKKKKKKKK subscribeFcn=', subscribeFcn);
        expect(createSubscriptionFcn({streamName, handlers, subscriberId})).toContainAllKeys([
          'loadPosition','start','stop','tick','writePosition',
        ]);
      } catch(e){
        throw new Error(e.message)
      }
    });
  });
});