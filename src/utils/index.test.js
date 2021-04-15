const badArgs = [
  [],
  null, undefined, 0, 'a', ()=>{}, {a:1},
  [null,null],
  [null,undefined],
  [1,null],
  [undefined,1],
  [,],
  ['a','a'],
  [[1],[2]],
  ['s',null],
  ['s',undefined],
  ['s', []],
  [{}],
  [()=>{},()=>{}],
  [1,{a:2}],
  [1,[]],
  [{},{}],
  ['1',()=>{}],
  ['1',[]],
  ['a',{}],
  [{a:1},[]],
  // [{a:1},['l']],
];

const {isObject, isEmptyObject, objHasProps} = require('./index');

describe('isObject() should return false if attacked with', () => {
  test('String', () => {
    expect(isObject('myString')).toEqual(false);
  });
  test('Object', () => {
    expect(isObject({ param: 'value' })).toEqual(true)
  });
  test('Array', () => {
    expect(isObject(['a', 'b', 'c'])).toEqual(false)
  });

  test('Set', () => {
    expect(isObject(new Set([1, 2, 4]))).toEqual(false)
  });

  test('Date', () => {
    expect(isObject(new Date())).toEqual(false)
  });

  test('Undefined', () => {
    expect(isObject(undefined)).toEqual(false)
  });

  test('Null', () => {
    expect(isObject(null)).toEqual(false)
  });

  test('Function', () => {
    expect(isObject(() => {})).toEqual(false)
  })

  test('Empty array', () => {
    expect(isObject([])).toEqual(false)
  })
});

describe('isEmptyObject() should', () =>{
  describe('should return false if attacked with a non-object', () => {
    test('null',()=>{
      expect(isEmptyObject(null)).toEqual(false)
    });
    test('undefined', () => {
      expect(isEmptyObject(undefined)).toEqual(false)
    });
    test('Date', () => {
      expect(isEmptyObject(new Date())).toEqual(false)
    });
    test('Set', () => {
      expect(isEmptyObject(new Set([1, 2, 4]))).toEqual(false)
    });
    test('Array', () => {
      expect(isEmptyObject(['a', 'b', 'c'])).toEqual(false)
    });
    test('String', () => {
      expect(isEmptyObject('myString')).toEqual(false);
    });
  });
  describe('return true if attacked with', () => {
    test('empty object', () => {
      expect(isEmptyObject({})).toEqual(true)
    });
  });
  describe('return false if atacked with', () => {
    test('non empty object', () => {
      expect(isEmptyObject({a:1})).toEqual(false);
    });
  });
  it('should also return false if attacked with empty array', () => {
    expect(isEmptyObject(([]))).toEqual(false);
  });
});

describe('objHasProps()', () => {
  it('throws if the first arg is not an object or the second arg is not an array of strings', () => {
    badArgs.forEach(function(args){
      expect(function(){
        objHasProps.apply(objHasProps, args)
      }).toThrow()
    })
  });

  it('returns false if the arg does not have the right shape', () => {
    const myObject = {a:1};
    const badPropsList = ['badProp'];
    expect(objHasProps(myObject, badPropsList)).toBe(false)
  });

  it('returns false if the arg is missing one prop in the designed prop list', () => {
    const myObject={a:1};
    const wantedPropList = ['a','b'];
    expect(objHasProps(myObject, wantedPropList)).toBe(false);
  });

  it('returns true if the arg does have the right shape', () => {
    const myObj = {a:1, c:3};
    const goodPropsList = ['a','c'];
    expect(objHasProps(myObj, goodPropsList)).toBe(true);
  });
});
