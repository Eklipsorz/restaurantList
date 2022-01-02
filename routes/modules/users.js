const mongoose = require('mongoose')
const express = require('express')
const passport = require('passport')

const router = express.Router()

const bcrypt = require('bcryptjs')

const userModel = require('../../models/userModel')


// GET /users/register
// render a register page
router.get('/register', (req, res) => {
  res.render('register', { layout: 'entryLayout' })
})

// POST /users/register
// create a new user according status of each field user inputs
router.post('/register', (req, res) => {

  const { name, email, password, confirmPassword } = req.body
  // define a array which stores all warning messages
  const registerWarningMessages = []

  // check whether there is something in email, password and confirmPassword
  if (!email || !password || !confirmPassword) {
    // one of three fields is empty, then it adds a warning flash message to registerWarningMessages
    registerWarningMessages.push('Please input these fields!!')
  }


  // check whether password is same as confirmPassword
  if (password !== confirmPassword) {
    // if password is different from confirmPasword, then it adds a waring flash
    // message to registerWarningMessages
    registerWarningMessages.push('The passwords are not same!!')
  }

  // if there is a message in registerWarningMessages, then render a register page
  // with some warning flash messages
  if (registerWarningMessages.length) {
    return res.render('register', {
      layout: 'entryLayout',
      registerWarningMessages,
      name,
      email,
      password,
      confirmPassword
    })
  }

  // if there is nothing in registerWarningMessages, then it check whether the email has 
  // been registered in this system, if the email is never register and it create a account
  // to the email
  return userModel.findOne({ email })
    .then(user => {

      // it check whether the email has been registered in this system
      if (user) {
        // email has been registered and push a warning message to registerWarningMessages
        registerWarningMessages.push('The email has been registered')

        // render a register page with all warning messages from registerWarningMessages
        return res.render('register', {
          layout: 'entryLayout',
          registerWarningMessages,
          name,
          email,
          password,
          confirmPassword
        })
      }

      // email has never been register, then it create a account to the email
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => {
          return userModel.create({
            name,
            email,
            password: hash
          })
        })
        .then(() => res.redirect('/'))
        .catch((error) => console.log(error))
    })


})

// GET /users/login
// render a login page
router.get('/login', (req, res) => {
  res.render('login', { layout: 'entryLayout' })
})

// POST /users/login
// authenticate current user with passport.js
router.post('/login', passport.authenticate('local', {
  // enable a flash message function for failure
  failureFlash: true,
  failureRedirect: '/users/login',
  successRedirect: '/'
}))


// GET /users/logout
// destory session and cookie for the account and render a login page with flash message
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('logout-success-message', 'You have successfully logged out')
  res.redirect('/users/login')
})

exports = module.exports = router