const {loadExistingIdentity} = require('./load-existing-identity');
const {badArgs, fakeContext} = require('../../unit-test-helpers');
const promiseReflect = require('promise-reflect');

jest.mock('./shallow-validate', () => Promise.resolve({a:1}));


describe('loadExistingIdentity()', () => {
  it('should throw when context not valid', async () => {
    let myErroredResultsPromiseArray = badArgs.map(v => {
      return loadExistingIdentity(v);
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

    // badArgs.forEach(arg => {
    //   // console.log('PPPPPPPPPPPPPPPP arg=', arg)
    //   expect(
    //     () => loadExistingIdentity(arg)
    //   ).toThrow('invalid context')
    // })
  });

  it('should return a Promise that solves in a context', () => {
    // expect.assertions(1);
    return loadExistingIdentity(fakeContext)
      .then(result => {
        expect(result).toMatchObject(fakeContext)
      })
  });
});