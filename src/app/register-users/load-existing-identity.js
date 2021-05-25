const {httpContextIsValid} = require('../../utils');

async function loadExistingIdentity(context){
  const loadExistingIdentityShape = [
    'userId',
    'attributes',
    'traceId',
    'passwordHash',
    'messageStore',
    'queries',
  ];
  if (!httpContextIsValid({
    context,
    propList: loadExistingIdentityShape,
  })
  ) {
    throw new TypeError('loadIdentityContext(): invalid context')
  }

  const res = await context.queries.byEmail(context.attributes.email)

  return context.queries
    .byEmail(context.attributes.email)
    .then(existingIdentity => {
      context.existingIdentity = existingIdentity

      return context;
    })
}

module.exports.loadExistingIdentity = loadExistingIdentity;