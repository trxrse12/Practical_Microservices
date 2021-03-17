/** @description Mount app routes into the Express app ...*/
function mountRoutes(app, config){
  app.use('/', config.homeApp.router);
}

module.exports = mountRoutes;