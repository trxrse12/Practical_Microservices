const createExpressApp = require('./app/express');
const createConfig = require('./config');
const env = require('./env');

const config = createConfig({env});
const app = createExpressApp({config, env});
let server;

function start() {
  config.aggregators.forEach(a => a.start());
  config.components.forEach(s => s.start());

  server = app.listen(env.port, signalAppStart);
  console.log('UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU server=', server)
}

function signalAppStart() {
  console.log(`${env.appName} started`);
  console.table([[`Port`, env.port], ['Environment', env.env]]);
}

module.exports = {
  app,
  config,
  start,
  server,
};