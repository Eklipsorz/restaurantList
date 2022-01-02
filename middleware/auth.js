function authenticator(req, res, next) {


  // if client is a memeber with valid session id
  if (req.isAuthenticated()) {
    return next()
  }

  // if client is not a memeber with valid session id
  req.flash('loginfirst-warning-message', 'You need to login first!!')
  res.redirect('/users/login')
}

exports = module.exports = authenticator