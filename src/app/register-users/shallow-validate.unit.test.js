const {fakeContext, fakeAttributes, badArgs} = require('../../test-helpers');
const shallowValidate = require('./shallow-validate');

describe('validate()', () => {
  it('should throw if no valid context argument', () => {
    badArgs.forEach(arg => {
      // console.log('PPPPPPPPPPPPPPPP arg=', arg)
      expect(
        () => shallowValidate(arg)
      ).toThrow()
    })
  });

  it('should throw if context has no valid shape', () => {
    const badProp = 'badProperty';
    function callWithUnexpectedArgumentProperties(){
      const badParam = {};
      badParam[badProp] = 'unexpected';
      const WriteRegisterCommandWrongArgResult = shallowValidate(badParam);
    }
    expect(callWithUnexpectedArgumentProperties)
      .toThrow("shallowValidation(): invalid context")
  });

  it('should throw if no valid validation engine', () => {
    badArgs.forEach(arg => {
      expect(
        () => shallowValidate(fakeContext, arg)
      ).toThrow("shallowValidation(): invalid validation engine")
    })
  });

  it('should throw if validation error', () => {
    const fakeValidationObject = {};
    fakeValidationObject.validate = () => {
      return {
        email: 'Email is not a valid email'
      }
    }; //mocked validator
    expect(() => shallowValidate(fakeContext, fakeValidationObject))
      .toThrow('Email is not a valid email')
  });

  it('should return context argument if no validation error', () => {
        const fakeValidationObject = {};
    fakeValidationObject.validate = () => {
      return null;
    }; //mocked validator
    expect(shallowValidate(fakeContext, fakeValidationObject)).toEqual(fakeContext);
  });
});