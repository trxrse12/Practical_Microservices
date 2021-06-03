const ConfigureCreateSubscription = require('./subscribe');
const { badArgs,
  fakeStream,
  fakeHandlers,
  fakeSubscriberId,
  fakeRead,
  fakeReadLastMessage,
  fakeWrite,
} = require('../test-helpers');

const read = () => Promise.resolve({a:1});
const readLastMessage = () => Promise.resolve({b:1});
const write = () => Promise.resolve({c:1});

describe('ConfigureCreateSubscription() should', () => {
  it('return a function ', () => {
    expect(
      ConfigureCreateSubscription({ read, readLastMessage, write })
    ).toBeInstanceOf(Function);
  });
  describe('and the returned createSubscription() should', () => {
    let createSubscriptionFcn;
    beforeEach(() => {
      createSubscriptionFcn = ConfigureCreateSubscription({read, readLastMessage, write});
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
    it.each(badArgs)(
      'throw if handlers is not an object that has non-empty functions as keys',
      (badArg) => {
      const streamName = 'identity:trxrse1-100010010';
      const handlers = badArg;
      try{
        createSubscriptionFcn({streamName, handlers});
        throw new Error('It should not get to this point: handlers=');
      } catch (e){
        expect(e.message).toBeTruthy();
      }
    });
    it.each(badArgs)(
      'throw if subscriberId is not a valid string that contains :',
      (badArg) => {
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
        expect(
          createSubscriptionFcn({ streamName, handlers, subscriberId })
        ).toContainAllKeys([
          'loadPosition',
          'start',
          'stop',
          'tick',
          'writePosition',
          '__private__',
        ]);
      } catch(e){
        throw new Error(e.message)
      }
    });
  });
});
describe('the subscribe function should include private', () => {
  let subscribeFunction, subscriptionResult;
  let privateInterface;
  beforeEach(() => {
    subscribeFunction = ConfigureCreateSubscription({
      read,
      readLastMessage,
      write,
    }); // at this stage, subscribe() present a __private__ test interface

    subscriptionResult = subscribeFunction({
      streamName: fakeStream,
      handlers: fakeHandlers,
      subscriberId: fakeSubscriberId,
    }); // the rest of the params are left to be initialized from defaults
    // eslint-disable-next-line no-underscore-dangle
    privateInterface = subscriptionResult.__private__;

  });
  describe('tick method should', () => {
    it('throw if exogenous getNextBatchOfMessages() does not exist', async () => {
      const tick = privateInterface.tick;
      try{
        expect(() => tick()).toThrow(/invalid getNextBatchOfMessage/);
      } catch(e){
        throw new Error(e?.message);
      }
    });
  });
  describe('processBatch() should', () => {
    let processBatch;
    beforeEach(() => {
      processBatch = privateInterface.processBatch;
    });
    it.each(badArgs)('throw if messages not an array of objects with id prop', async (badArg) => {
      try{
        const res = await processBatch(badArg);
        throw new Error('It should not be here!!!')
      } catch (err) {
        expect(err?.message).toMatch(/invalid messages arg/);
      }
    });
    it.only('', () => {

    });
  });
  describe('handleMessage() should', () => {
    let handleMessage;
    beforeEach(() => {
      handleMessage = privateInterface.handleMessage;
    });
    it.each(badArgs)('throw if message is not an object', async (badArg) => {
      try{
        await handleMessage(badArg)
          .then((res) => {
            throw new Error('should not be here!!!')
          })
      } catch (err){
        expect(err?.message).toMatch(/(invalid handler)|(invalid message arg)/)
      }
    });
    it('call the exogenous handler() with the message.type and return what the handler returned', async () => {
      const message = {type: 'read'}; // the same type is included in my fakeHandler
      try{
        const res = await handleMessage(message);
        expect(res).toBe('I did read this');
      } catch(err){
        throw new Error(err?.message);
      }
    });
    it('call the exogenous handler() and does nothing if the handler rejects', async () => {
      try{
        const message = {type: 'readWithRejection'};
        const res = await handleMessage(message);
        expect(res).toBe(true);
      } catch(err){
        throw new Error(err?.message);
      }
    });
    it('all the exogenous handler() and does nothing if the handler throws', async () => {
      try{
        const message = {type: 'readWithError'};
        const res = await handleMessage(message);
        expect(res).toBe(true);
      }catch(err){
        throw new Error(err?.message);
      }
    });
  });
});
describe('writePosition()', () => {
  it('should throw if no valid argument', async () => {
    const subscribe = ConfigureCreateSubscription({
      read: fakeRead,
      readLastMessage: fakeReadLastMessage,
      write: fakeWrite,
    });
    let writePosition;
    try {
      ({ writePosition } = subscribe({
        streamName: fakeStream,
        handlers: fakeHandlers,
        subscriberId: fakeSubscriberId,
      }));
    } catch(e){
      expect(() => writePosition(null)).toThrow(/invalid argument/)
    }
  });
});

describe('loadPosition()', () => {
  it('should throw if ', () => {
    
  });
});
