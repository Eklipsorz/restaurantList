const passport = require('passport')

const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const userModel = require('../models/userModel')

function usePassport(app) {

  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
  }, (req, email, password, done) => {

    userModel.findOne({ email })
      .then(user => {
        // cannot find user
        if (!user) return done(null, false)
        // successfully find the user, but we need to check their password
        return bcrypt.compare(password, user.password)
          .then(isMatched => {
            // the password is not matched
            if (!isMatched) return done(null, false)
            // the password is matched
            return done(null, user)
          })
      })
      // something wrong in the execution
      .catch(err => done(err, false))
  }))


  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser((id, done) => {
    userModel.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(error => done(error, false))
  })

}


exports = module.exports = usePassport