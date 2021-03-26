/** @description Mount app routes into the Express app ...*/
function mountRoutes(app, config){
  if (!config?.homeApp?.router){
    throw new Error('Invalid route handler');
  }
  app.use('/', config.homeApp.router);
  app.use('/record-viewing', config.recordViewingsApp.router)
}

module.exports = mountRoutes;