const passport = require('passport')

const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy

const bcrypt = require('bcryptjs')
const userModel = require('../models/userModel')

function usePassport(app) {

  // initialize passport and passport session function
  app.use(passport.initialize())
  app.use(passport.session())

  // define a local validation strategy which passport.js could use
  passport.use(new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
  }, (req, email, password, done) => {
    // when passport obtains email and password

    // check whether the email has been registered
    userModel.findOne({ email })
      .then(user => {
        // cannot find user
        if (!user) return done(null, false, { message: 'The email is not registered' })
        // successfully find the user, but we need to check their password
        return bcrypt.compare(password, user.password)
          .then(isMatched => {
            // the password is not matched
            if (!isMatched) return done(null, false, { message: 'Incorrect email or password!!' })
            // the password is matched
            return done(null, user)
          })
      })
      // something wrong in the execution
      .catch(err => done(err, false))
  }))

  // define a facebook validation strategy which passport.js could use
  passport.use(new FacebookStrategy({
    // define a set of data for authentication
    clientID: process.env['FACEBOOK_ID'],
    clientSecret: process.env['FACEBOOK_SECRET'],
    callbackURL: process.env['FACEBOOK_CALLBACK'],

    // define what profile._json is 
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    // when passport.js obtains profile data with accessToken

    const { email, name } = profile._json
    // check whether the email has been registered
    userModel.findOne({ email })
      .then(user => {
        // if exists
        if (user) return done(null, user)

        // if not, then it create a new user
        const newPassword = Math.random().toString(36).slice(-8)

        return bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(newPassword, salt))
          .then(hash => {
            return userModel.create({
              name,
              email,
              password: hash
            })
          })
          .then(user => done(null, user))
          .catch(error => done(error, false))
      })
  }))

  // define how to serialize and how to deserialize
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