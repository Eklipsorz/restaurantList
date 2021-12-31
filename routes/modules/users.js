const mongoose = require('mongoose')
const express = require('express')
const passport = require('passport')

const router = express.Router()

const bcrypt = require('bcryptjs')

const userModel = require('../../models/userModel')

router.get('/register', (req, res) => {
  res.render('register', { layout: 'entryLayout' })
})

router.post('/register', (req, res) => {

  const { name, email, password, confirmPassword } = req.body
  const registerWarningMessages = []

  if (!email || !password || !confirmPassword) {
    registerWarningMessages.push('Please input these fields!!')
  }

  if (password !== confirmPassword) {
    registerWarningMessages.push('The passwords are not same!!')
  }

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

  return userModel.findOne({ email })
    .then(user => {
      if (user) {
        registerWarningMessages.push('The email has been registered')
        return res.render('register', {
          layout: 'entryLayout',
          registerWarningMessages,
          name,
          email,
          password,
          confirmPassword
        })
      }

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

router.get('/login', (req, res) => {
  res.render('login', { layout: 'entryLayout' })
})

router.post('/login', passport.authenticate('local', {
  failureFlash: true,
  failureRedirect: '/users/login',
  successRedirect: '/'
}))


router.get('/logout', (req, res) => {
  req.logout()
  req.flash('logout-success-message', 'You have successfully logged out')
  res.redirect('/users/login')
})

exports = module.exports = router