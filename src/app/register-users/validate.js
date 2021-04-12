const validate = require('validate');

const validationError = require('../errors/validation-error');

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

function v(context){
  const validationErrors = validate(context, attributes, constraints);

  if (validationErrors){
    throw new ValidtionError(validationErrors)
  }

  return context;
}

module.exports = v;



