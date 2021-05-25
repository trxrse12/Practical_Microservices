const bcrypt = require('bcrypt');

// TODO: move this intop an env var file
const SALT_ROUNDS = 10;

async function hashPassword(context) {
  if (!context) {
    throw new TypeError('hashPassword(): invalid context arg')
  }

  const result = await bcrypt;
  const hashResult = await result.hash(
    context?.attributes?.password,
    SALT_ROUNDS
  );
  const modifiedContext = await hashResult.then((passwordHash) => {
    context.passwordHash = passwordHash;
    return context;
  });
  return modifiedContext;
}

module.exports = hashPassword;
