const validationError = require('../errors/validation-error');

function ensureThereWasNoExistingIdenity(context){
  if (context.existingIdenity){
    throw new ValidationError({email: ['already taken']});
  }

  return context;
}

module.exports = ensureThereWasNoExistingIdenity;