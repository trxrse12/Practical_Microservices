const { fakeContext, badArgs } = require('../../test-helpers');
const shallowValidate = require('./shallow-validate');

describe('validate()', () => {
  let context;
  beforeEach(() => {
    context = fakeContext;
  });
  it('should throw if no valid context argument', () => {
    badArgs.forEach((arg) => {
      // console.log('PPPPPPPPPPPPPPPP arg=', arg)
      expect(() => shallowValidate(arg)).toThrow();
    });
  });

  it('should throw if context has no valid shape', () => {
    const badProp = 'badProperty';
    function callWithUnexpectedArgumentProperties() {
      const badParam = {};
      badParam[badProp] = 'unexpected';
      const WriteRegisterCommandWrongArgResult = shallowValidate(badParam);
    }
    expect(callWithUnexpectedArgumentProperties).toThrow(
      'shallowValidation(): invalid context'
    );
  });

  it('should throw if validation error', () => {
    context = { ...context, attributes: {} };
    expect(() => shallowValidate(context)).toThrow(
      /Validation error/
    )
  });

  it('should return context argument if no validation error', () => {
    const result = shallowValidate(context);
    expect(result).toEqual(context);
  });
});
