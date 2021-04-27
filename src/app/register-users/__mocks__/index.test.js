const build =require('../index');
const promiseReflect = require('promise-reflect');
const {fakeDb, badArgs} = require('../../../test-helpers');

jest.mock('../shallow-validate');
const shallowValidate = require('./shallow-validate').default;

jest.mock('../write-register-command');
const writeRegisterCommand = require('./write-register-command').default;

const db = fakeDb;
const messageStore = {a:1};

describe('the register-user app factory', () => {
  let registerUserApp;
  beforeEach(() => {

  });

  it('should return an object', () => {
    registerUserApp = build({db, messageStore});
    expect(registerUserApp).toEqual(expect.objectContaining({
      actions: expect.anything(),
      handlers: expect.anything(),
      queries: expect.anything(),
      routers: expect.anything(),
    }))
  });

  it('should throw if no valid parameters passed to it', () => {
    expect(() => build()).toThrow();
    expect(() => build(1,2,3)).toThrow();
  });

  it('should throw if non-object passed as db parameter', () => {
    expect(() => build({db:9, messageStore})).toThrow('registerUsers build(): db should be an object');
  });

  it('should throw if a non-object passed as messageStore as parameter', () => {
    const invalidMessageStore = 21;
    expect(() => build({db, messageStore:invalidMessageStore})).toThrow('registerUsers build(): messageStore should be an object')
  });

  it('should throw if empty db object provided as argument', () => {
    const invalidDb = {};
    expect(() => build({db: invalidDb, messageStore})).toThrow('registerUser build(): empty db object parameter')
  });

  it('should throw if empty messageStore object provided as argument', () => {
    const invalidMessageStore = {};
    expect(() => build({db, messageStore: invalidMessageStore})).toThrow('registerUser build(): empty messageStore object parameter')
  });

  describe('should return an actions object, which should', () => {
    let registerUserApp;
    let actions = {};
    beforeEach(() => {
      registerUserApp = build({db, messageStore});
      ({actions} = registerUserApp);
    });
    it('have a registerUser function property', () => {
      expect(actions).toMatchObject({registerUser: expect.any(Function)})
    });
    describe('and registerUser(traceId, attributes) inner function', () => {
      test('should return a Promise that solves in a the value returned by the db', () => {
        const fakeTraceId = '123';
        const fakeAttributes = {email:'t@t.com', password:"***"}

        return actions.registerUser(fakeTraceId, fakeAttributes)
          .then(async result => {
            expect(result).toEqual([{a:1}, {b:2}])});
      });
      it('throws if any argument is missing or the wrong type', async () => {
        let myErroredResultsPromiseArray = badArgs.map(v => {
          if (Array.isArray(v)){
            return actions.registerUser.apply(actions.registerUser, v)
          } else {
            return actions.registerUser(v);
          }
        });

        const complexTestResults = await Promise.all(
          myErroredResultsPromiseArray.map(promiseReflect))
            .then(values => {
              let resolved = values.filter(value => value.status === 'resolved');
              // console.log('RESOLVED: ', resolved);
              let rejected = values.filter(value => value.status === 'rejected');
              // console.log('REJECTED: ', rejected)
              return resolved;
            })
            .catch(reason => {
              console.log('should NOT be here!!!')
        });
        // console.log('complexTestResults=: ', complexTestResults)
        expect(complexTestResults.length).toBe(0);
      });

      it('throws if the attributes argument does not have the right shape', async () => {
        const incompleteArgs = [
          ['traceId',{a:1}],
          ['traceId',{email:'t@g.com'}],
          ['traceId',{password:''}],
          // ['traceId',{email:'R',password:'t'}]
        ];

        let myErroredResultsPromiseArray = incompleteArgs.map(v => {
          if (Array.isArray(v)){
            return actions.registerUser.apply(actions.registerUser, v)
          } else {
            return actions.registerUser(v);
          }
        });

        const complexTestResults = await Promise.all(
          myErroredResultsPromiseArray.map(promiseReflect))
            .then(values => {
              let resolved = values.filter(value => value.status === 'resolved');
              // console.log('RESOLVED: ', resolved);
              let rejected = values.filter(value => value.status === 'rejected');
              // console.log('REJECTED: ', rejected)
              return resolved;
            })
            .catch(reason => {
              console.log('should NOT be here!!!')
        });
        // console.log('complexTestResults=: ', complexTestResults)
        expect(complexTestResults.length).toBe(0);
      });


    });
  });
});