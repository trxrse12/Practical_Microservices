const {
  isObject,
  isEmptyObject,
  objHasProps,
  flipConfig,
  httpContextIsValid,
} = require('./index');

const { fakeContext } = require('../test-helpers');

const badArgs = [
  [],
  null,
  undefined,
  0,
  'a',
  () => {},
  { a: 1 },
  [null, null],
  [null, undefined],
  [1, null],
  [undefined, 1],
  [,],
  ['a', 'a'],
  [[1], [2]],
  ['s', null],
  ['s', undefined],
  ['s', []],
  [{}],
  [() => {}, () => {}],
  [1, { a: 2 }],
  [1, []],
  [{}, {}],
  ['1', () => {}],
  ['1', []],
  ['a', {}],
  [{ a: 1 }, []],
  // [{a:1},['l']],
];

describe('isObject() should return false if attacked with', () => {
  test('String', () => {
    expect(isObject('myString')).toEqual(false);
  });
  test('Object', () => {
    expect(isObject({ param: 'value' })).toEqual(true);
  });
  test('Array', () => {
    expect(isObject(['a', 'b', 'c'])).toEqual(false);
  });

  test('Set', () => {
    expect(isObject(new Set([1, 2, 4]))).toEqual(false);
  });

  test('Date', () => {
    expect(isObject(new Date())).toEqual(false);
  });

  test('Undefined', () => {
    expect(isObject(undefined)).toEqual(false);
  });

  test('Null', () => {
    expect(isObject(null)).toEqual(false);
  });

  test('Function', () => {
    expect(isObject(() => {})).toEqual(false);
  });

  test('Empty array', () => {
    expect(isObject([])).toEqual(false);
  });
});

describe('isEmptyObject() should', () => {
  describe('should return false if attacked with a non-object', () => {
    test('null', () => {
      expect(isEmptyObject(null)).toEqual(false);
    });
    test('undefined', () => {
      expect(isEmptyObject(undefined)).toEqual(false);
    });
    test('Date', () => {
      expect(isEmptyObject(new Date())).toEqual(false);
    });
    test('Set', () => {
      expect(isEmptyObject(new Set([1, 2, 4]))).toEqual(false);
    });
    test('Array', () => {
      expect(isEmptyObject(['a', 'b', 'c'])).toEqual(false);
    });
    test('String', () => {
      expect(isEmptyObject('myString')).toEqual(false);
    });
  });
  describe('return true if attacked with', () => {
    test('empty object', () => {
      expect(isEmptyObject({})).toEqual(true);
    });
  });
  describe('return false if atacked with', () => {
    test('non empty object', () => {
      expect(isEmptyObject({ a: 1 })).toEqual(false);
    });
  });
  it('should also return false if attacked with empty array', () => {
    expect(isEmptyObject([])).toEqual(false);
  });
});

describe('objHasProps()', () => {
  it('throws if the first arg is not an object or the second arg is not an array of strings', () => {
    badArgs.forEach((args) => {
      expect(() => {
        objHasProps.apply(objHasProps, args);
      }).toThrow();
    });
  });

  it('returns false if the arg does not have the right shape', () => {
    const myObject = { a: 1 };
    const badPropsList = ['badProp'];
    expect(objHasProps(myObject, badPropsList)).toBe(false);
  });

  it('returns false if the arg is missing one prop in the designed prop list', () => {
    const myObject = { a: 1 };
    const wantedPropList = ['a', 'b'];
    expect(objHasProps(myObject, wantedPropList)).toBe(false);
  });

  it('returns true if the arg does have the right shape', () => {
    const myObj = { a: 1, c: 3 };
    const goodPropsList = ['a', 'c'];
    expect(objHasProps(myObj, goodPropsList)).toBe(true);
  });

  it('triangle: returns true if the arg does have the right shape', () => {
    const myObj ={
      userId: 'e29cbf58-6cf8-4dc8-a41e-0d4aa5ca27da',
      attributes: { id: '5cfeb477-1c12-497c-8835-e1b4d11e2280', email: 'me@me.com' },
      traceId: '82afb560-097a-4ef1-8a6c-314e26173e54',
      passwordHash: '321123AB',
      messageStore: {
        write: jest.fn()
      },
      queries: { byEmail: jest.fn() }
    };

    const goodPropsList = [
      'userId',
      'attributes',
      'traceId',
      'passwordHash',
      'messageStore',
      'queries',
    ];

    expect(objHasProps(myObj, goodPropsList)).toBe(true);
  });
});

describe('flipConfig()', () => {
  it('should throw if input argument is not a function', () => {
    const myNonFunctionArg = { a: 1 };
    expect(() => {
      flipConfig(myNonFunctionArg);
    }).toThrow('flipConfig error: argument should be a function');
  });
  it('should return another function', () => {
    const result = flipConfig((a) => {
      1;
    });
    expect(typeof result === 'function').toBe(true);
  });
  it('triangle 1 - should return a function that is the initial function with the first param in the last position', () => {
    const fn = (a, b, c) => a + b + c;
    const result = flipConfig(fn);
    expect(result(1, 2, 3)).toBe(fn(2, 3, 1));
  });
  it('triangle 2 - should return a function that is the initial function with the first param in the last position', () => {
    const fn = (a, b, c) => ({ a, b, c });
    const result = flipConfig(fn);
    const config = { a: 1 };
    const o2 = { b: 1 };
    const o3 = { c: 1 };
    expect(result(config, o2, o3)).toEqual(fn(o2, o3, config));
  });
  it('triangle 3 - should return a function that is the initial function with the first param in the last position', () => {
    const fn = (a, b, c) => ({ a, b, c });
    const result = flipConfig(fn);
    const config = { a: { A: 1 } };
    const o2 = { b: { B: 1 } };
    const o3 = { c: { C: 1 } };
    expect(result(config, o2, o3)).toEqual(fn(o2, o3, config));
  });
  it('triangle 4 - should return a function (of 4 params) that is the initial function with the first param in the last position', () => {
    const fn = (a, b, c, d) => ({ a, b, c, d });
    const result = flipConfig(fn);
    const config = { a: 1 };
    const o2 = { b: 1 };
    const o3 = { c: 1 };
    const o4 = { d: 1 };
    expect(result(config, o2, o3, o4)).toEqual(fn(o2, o3, o4, config));
  });
  it('triangle 5 - should return a function (of 2 params) that is the initial function with the first param in the last position', () => {
    const fn = (a, b) => ({ a, b });
    const result = flipConfig(fn);
    const config = { a: 1 };
    const o2 = { b: 1 };
    expect(result(config, o2)).toEqual(fn(o2, config));
  });
  it('triangle 6 - should return a function (of 1 params) that is the initial function with the first param in the last position', () => {
    const fn = (a) => ({ a, x: 100 });
    const result = flipConfig(fn);
    const config = { u: 100 };
    const a = { A: 10000 };
    expect(result(config, a)).toEqual(fn(a, config));
  });
  it('should throw if the input function has no arguments', () => {
    const fn = () => 100;
    const config = { a: 1 };
    const o1 = { M: 1000 };
    expect(() => flipConfig(fn)).toThrow(
      'flipConfig error: argument function should have at least a parameter'
    );
  });
});

describe('httpContextValid()', () => {
  it('should return false if context is not an object', () => {
    const goodPropList = ['a', 'b'];
    badArgs.forEach((badArg) => {
      expect(httpContextIsValid({ badArg, goodPropList })).toBe(false);
    });
  });
  it('should return false if propList is not an array', () => {
    badArgs
      .filter((badArg) => badArg !== ['a', 'a'])
      .forEach((badArg) => {
        expect(httpContextIsValid({ context: fakeContext, propList: badArg })).toBe(false);
      });
  });
});
