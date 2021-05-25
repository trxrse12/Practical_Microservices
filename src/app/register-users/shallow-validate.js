const Ajv = require('ajv');
const userSchema = require('../../schema/user-credentials.json');

const ajvValidate = new Ajv({
  allErrors: true,
  // eslint-disable-next-line global-require
  // keywords: require('ajv-keywords/dist/definitions'),
  strict: false, // to get rid of console.warning
})
  .addFormat('email', /^[\w.+]+@\w+\.\w+$/)
  .addSchema([userSchema])
  .compile(userSchema);

require('ajv-keywords/dist/definitions')(ajvValidate)

const { httpContextIsValid } = require('../../utils');

const ValidationError = require('../errors/validation-error');

function shallowValidate(context) {
  const registerUserContextShape = [
    'attributes',
    'traceId',
    'messageStore',
    'queries',
  ];
  if (!httpContextIsValid({ context, propList: registerUserContextShape })) {
    throw new TypeError('shallowValidation(): invalid context:', context);
  }

  const validate = ajvValidate(context.attributes);
  const validationErrors = ajvValidate.errors;

  if (!validate) {
    throw new ValidationError(validationErrors);
  }
  return context;
}

module.exports = shallowValidate;
