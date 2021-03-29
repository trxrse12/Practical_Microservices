/** @description Mount app routes into the Express app ...*/
function mountRoutes(app, config){
  if (!config?.homePageAggregator?.router){
    throw new Error('Invalid route handler');
  }
  if (!app?.use){
    throw new Error('Invalid Express app object parameter')
  }
  app.use('/', config.homePageAggregator.router);
  app.use('/record-viewing', config.recordViewingsApp.router)
}

module.exports = mountRoutes;