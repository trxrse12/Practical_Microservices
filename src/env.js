const colors = require('colors/safe');
const dotenv = require('dotenv');

const packageJson = require('../package.json');

const envResult = dotenv.config();

if (envResult.error){
  console.error(
    `${colors.red('[ERROR] anv failed to load:')} ${envResult.error}`
  );

  process.exit(1);
}


function requireFromEnv(key){
  if (!process.env[key]){
    console.error(`${colors.red('[APP ERROR] Missing env variable:')} ${key}`)

    return process.exit(1);
  }

  return process.env[key];
}

module.exports = {
  appName: requireFromEnv('APP_NAME'),
  cookieSecret: requireFromEnv('COOKIE_SECRET'),
  databaseUrl: requireFromEnv('DATABASE_URL'),
  env: requireFromEnv('NODE_ENV'),
  port: parseInt(requireFromEnv('PORT'), 10),
  emailDirectory: requireFromEnv('EMAIL_DIRECTORY'),
  systemSenderEmailAddress: requireFromEnv('SYSTEM_SENDER_EMAIL_ADDRESS'),
  version: packageJson.version,
  messageStoreConnectionString:
    requireFromEnv('MESSAGE_STORE_CONNECTION_STRING'),
};

