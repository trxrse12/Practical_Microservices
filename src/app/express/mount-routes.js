/** @description Mount app routes into the Express app ...*/
function mountRoutes(app, config){
  console.log('AAAAAAAAAAAAAAAAAAA config=', config)
  if (!config?.homeApp?.router){
    throw new Error('Invalid route handler');
  }
  if (!app?.use){
    throw new Error('Invalid Express app object parameter')
  }
  app.use('/', config.homeApp.router);
  app.use('/record-viewing', config.recordViewingsApp.router)
}

module.exports = mountRoutes;