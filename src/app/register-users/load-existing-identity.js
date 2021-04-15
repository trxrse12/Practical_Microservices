const {httpContextIsValid} = require('../../utils');


async function loadExistingIdentity(context){
  if (!httpContextIsValid({context})){
    throw new TypeError('loadIdentityContext(): invalid context')
  }

  return context.queries
    .byEmail(context.attributes.email)
    .then(existingIdentity => {
      context.existingIdentity = existingIdentity

      return context;
    })
}

module.exports.loadExistingIdentity = loadExistingIdentity;