const {v4:uuid} = require('uuid');

function primeRequestContext (req, res, next){
  req.context = {
    traceid: uuid()
  };

  next();
}

module.exports = primeRequestContext;