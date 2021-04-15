const bcrypt = require('bcrypt');

// TODO: move this intop an env var file
const SALT_ROUNDS = 10;

function hashPassword(context){
  return bcrypt
    .hash(context.attributes.password, SALT_ROUNDS)
    .then(passwordHash => {
      context.passwordHash = passwordHash;

      return context;
    })
}

module.exports = hashPassword;