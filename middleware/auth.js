function authenticator(req, res, next) {

  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/users/login')
}

exports = module.exports = authenticator