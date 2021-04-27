/** @description Mount app routes into the Express app ...*/
const express = require('express');
const mustBeLoggedIn = require('./must-be-logged-in');
const {join} = require('path');

function mountRoutes(app, config){
  if (!config?.homeApp?.router){
    throw new Error('Invalid route handler');
  }
  if (!app?.use){
    throw new Error('Invalid Express app object parameter')
  }
  app.use('/', config.homeApp.router);
  app.use('/record-viewing', config.recordViewingsApp.router);
  app.use('/register', config.registerUsersApp.router);
  app.use('/auth', config.authenticateApp.router);
  app.use('./creators-portal',mustBeLoggedIn, config.creatorsPortalApp.router);
  app.use(
    express.static(join(__dirname, '..', 'public'), {maxAge: 86400000})
  )
}

module.exports = mountRoutes;