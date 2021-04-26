function mustBeLoggedIn(req, res, next){
  if (!req.context.userId){
    return res.redirect('/auth/log-in')
  }

  return next();
}

module.exports = mustBeLoggedIn;