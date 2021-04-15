const validationClass = require('validate');
const validationObject = new validationClass();
const {httpContextIsValid} = require('../../utils');
const {isObject, objHasProps, isEmptyObject} = require('../../utils');
//
const ValidationError = require('../errors/validation-error');

const constraints ={
  email: {
    email: true,
    presence: true
  },
  password: {
    length: {minimum:8},
    presence: true,
  }
};

function shallowValidate(context, validationObject){
  // if(!isObject(context) || !objHasProps(context, [
  //   'attributes', 'traceId', 'passwordHash', 'messageStore']))
  // {
  //   throw new TypeError("shallowValidation(): invalid context:", context)
  // }
  if (!httpContextIsValid({context})){
    throw new TypeError("shallowValidation(): invalid context:", context)
  }

  if (!isObject(validationObject) || !objHasProps(validationObject, [
    'validate',
    ]) ){
    throw new TypeError("shallowValidation(): invalid validation engine:", context)
  }
  const validationErrors = validationObject.validate(context?.attributes, constraints);

  if (validationErrors){
    throw new ValidationError(validationErrors)
  }

  return context;
}

module.exports = shallowValidate;



