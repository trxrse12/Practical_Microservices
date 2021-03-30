
const express = require('express');
const {join} = require('path');

const mountMiddleware = require('./mount-middleware');
const mountRoutes = require('./mount-routes');

function createExpressApp ({config, env}){
  const app = express();
  // Configure PUG
  app.set('views', join(__dirname, '..'));
  app.set('view engine', 'pug');

  mountMiddleware(app, env);
  try {
    mountRoutes(app, config);
  } catch {

  }

  return app;
}

module.exports = createExpressApp;

