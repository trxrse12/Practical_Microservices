const uuid = require('uuid/v4');

function primeRequestContext (req, res, next){
  req.context = {
    traceid: uuid()
  };

  next();
}

module.exports = primeRequestContext;