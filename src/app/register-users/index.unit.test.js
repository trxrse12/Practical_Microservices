const promiseReflect = require('promise-reflect');
const build = require('./index');
const { fakeDb, badArgs, fakeMessageStore } = require('../../test-helpers');

// jest.mock('./shallow-validate');
// const shallowValidate = require('./__mocks__/shallow-validate').default;
// const shallowValidate = require('./shallow-validate');

// jest.mock('./write-register-command');
// const writeRegisterCommand = require('./__mocks__/write-register-command').default;
// const writeRegisterCommand = require('./write-register-command');

const db = fakeDb;
const messageStore = fakeMessageStore;

describe('the register-user app factory', () => {
  let registerUserApp;
  beforeEach(() => {});

  it('should return an object', () => {
    registerUserApp = build({ db, messageStore });
    expect(registerUserApp).toEqual(
      expect.objectContaining({
        actions: expect.any(Object),
        handlers: expect.any(Object),
        queries: expect.any(Object),
        // routers: expect.any(Array),
      })
    );
  });

  it('should throw if no valid parameters passed to it', () => {
    expect(() => build()).toThrow();
    expect(() => build(1, 2, 3)).toThrow();
  });

  it('should throw if non-object passed as db parameter', () => {
    expect(() => build({ db: 9, messageStore })).toThrow(
      'registerUsers build(): db should be an object'
    );
  });

  it('should throw if a non-object passed as messageStore as parameter', () => {
    const invalidMessageStore = 21;
    expect(() => build({ db, messageStore: invalidMessageStore })).toThrow(
      'registerUsers build(): messageStore should be an object'
    );
  });

  it('should throw if empty db object provided as argument', () => {
    const invalidDb = {};
    expect(() => build({ db: invalidDb, messageStore })).toThrow(
      'registerUser build(): empty db object parameter'
    );
  });

  it('should throw if empty messageStore object provided as argument', () => {
    const invalidMessageStore = {};
    expect(() => build({ db, messageStore: invalidMessageStore })).toThrow(
      'registerUser build(): empty messageStore object parameter'
    );
  });

  describe('should return an actions object, which should', () => {
    let actions = {};
    beforeEach(() => {
      // us the mocked shallowValidate module
      // const shallowValidate = jest.mock('./shallow-validate');
      // const shallowValidateMocked = require('./__mocks__/shallow-validate').default;
      // shallowValidate.mockImplementation()

      registerUserApp = build({ db, messageStore });

      ({ actions } = registerUserApp);
    });
    it('have a registerUser function property', () => {
      expect(actions).toMatchObject({ registerUser: expect.any(Function) });
    });
    describe('and registerUser(traceId, attributes) inner function', () => {
      test('should return a Promise that solves in a the value returned by the db', () => {
        const fakeTraceId = '123';
        const fakeAttributes = {
          email: 't@t.com',
          password: 'cucu_bau-123',
        };

        return actions
          .registerUser(fakeTraceId, fakeAttributes)
          .then((result) => {
            expect(result).toEqual({ write: 400 });
          });
      });
      it('throws if any argument is missing or the wrong type', async () => {
        const myErroredResultsPromiseArray = badArgs.map((v) => {
          if (Array.isArray(v)) {
            return actions.registerUser.apply(actions.registerUser, v);
          }
          return actions.registerUser(v);
        });

        const complexTestResults = await Promise.all(
          myErroredResultsPromiseArray.map(promiseReflect)
        )
          .then((values) => {
            const resolved = values.filter(
              (value) => value.status === 'resolved'
            );
            // console.log('RESOLVED: ', resolved);
            const rejected = values.filter(
              (value) => value.status === 'rejected'
            );
            // console.log('REJECTED: ', rejected)
            return resolved;
          })
          .catch((reason) => {
            console.log('should NOT be here!!!');
          });
        // console.log('complexTestResults=: ', complexTestResults)
        expect(complexTestResults.length).toBe(0);
      });

      it('throws if the attributes argument does not have the right shape', async () => {
        const incompleteArgs = [
          ['traceId', { a: 1 }],
          ['traceId', { email: 't@g.com' }],
          ['traceId', { password: '' }],
          // ['traceId',{email:'R',password:'t'}]
        ];

        const myErroredResultsPromiseArray = incompleteArgs.map((v) => {
          if (Array.isArray(v)) {
            return actions.registerUser.apply(actions.registerUser, v);
          }
          return actions.registerUser(v);
        });

        const complexTestResults = await Promise.all(
          myErroredResultsPromiseArray.map(promiseReflect)
        )
          .then((values) => {
            const resolved = values.filter(
              (value) => value.status === 'resolved'
            );
            // console.log('RESOLVED: ', resolved);
            const rejected = values.filter(
              (value) => value.status === 'rejected'
            );
            // console.log('REJECTED: ', rejected)
            return resolved;
          })
          .catch((reason) => {
            console.log('should NOT be here!!!');
          });
        // console.log('complexTestResults=: ', complexTestResults)
        expect(complexTestResults.length).toBe(0);
      });
    });
  });
});
