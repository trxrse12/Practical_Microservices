const build = require('./index');
const { fakeDb, badArgs, fakeMessageStore, fakeContext } = require('../../test-helpers');

jest.mock('./shallow-validate', () => () => Promise.resolve({a:1}));
jest.mock('./load-existing-identity', () => () => Promise.resolve({b:1}));
jest.mock('./ensure-there-was-no-existing-identity', () => () => Promise.resolve({c:1}));
jest.mock('./hash-password', () => () => Promise.resolve({d:1}));
jest.mock('./write-register-command', () => () => Promise.resolve({e:1}));

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
    beforeEach(async () => {
      // us the mocked shallowValidate module
      // const shallowValidate = jest.mock('./shallow-validate');
      // const shallowValidateMocked = require('./__mocks__/shallow-validate').default;
      // shallowValidate.mockImplementation()

      registerUserApp = await build({ db, messageStore });

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
          userId: 'trxrse',
        };
        actions.registerUser(fakeTraceId, fakeAttributes)
          .then(result => {
          expect(result).toBe({ e: 1 });
        });
      });
      it('throws if any argument is missing or the wrong type', () => {
        const myErroredResultsPromiseArray = badArgs.map((v) => {
          if (Array.isArray(v)) {
            expect(() => actions.registerUser.apply(actions.registerUser, v)).toThrow();
          }
          expect(() => actions.registerUser(v)).toThrow();
        });
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
            expect(() => actions.registerUser.apply(actions.registerUser, v)).toThrow();

          }
          expect(() => actions.registerUser(v)).toThrow()
        });
      });
    });
  });
});
