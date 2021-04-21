/** @description Mount app routes into the Express app ...*/
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
}

module.exports = mountRoutes;