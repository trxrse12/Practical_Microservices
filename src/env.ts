// @ts-check

import { DotenvConfigOutput } from 'dotenv';

const colors = require('colors/safe');
const dotenv = require('dotenv');

// @ts-ignore
const packageJson = require('../package.json');

const envResult: DotenvConfigOutput = dotenv.config();

if (envResult.error){
  console.error(
    `${colors.red('[ERROR] anv failed to load:')} ${envResult.error}`
  );

  process.exit(1);
}

export interface ProcessEnv {
  [key: string]: string | number | undefined;
}

function requireFromEnv(key: string): ProcessEnv {
  const processEnvKey: ProcessEnv = process.env[
    key
  ]?.toString() as unknown as ProcessEnv;

  if (!processEnvKey) {
    console.error(`${colors.red('[APP ERROR] Missing env variable:')} ${key}`);

    return process.exit(1);
  }

  if (typeof processEnvKey === 'string') {
    return processEnvKey;
  }
  throw new Error('ProcessEnv() error: invalid process.env key');
}

module.exports = {
  appName: requireFromEnv('APP_NAME'),
  cookieSecret: requireFromEnv('COOKIE_SECRET'),
  databaseUrl: requireFromEnv('DATABASE_URL'),
  env: requireFromEnv('NODE_ENV'),
  port: Math.floor(Number(requireFromEnv('PORT'))),
  emailDirectory: requireFromEnv('EMAIL_DIRECTORY'),
  systemSenderEmailAddress: requireFromEnv('SYSTEM_SENDER_EMAIL_ADDRESS'),
  version: packageJson.version,
  messageStoreConnectionString:
    requireFromEnv('MESSAGE_STORE_CONNECTION_STRING'),
};

