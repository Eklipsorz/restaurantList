const mongoose = require('mongoose')
const express = require('express')
const passport = require('passport')
const router = express.Router()



router.get('/register', (req, res) => {
  res.render('register', { layout: 'entryLayout' })
})

router.post('/register', (req, res) => {

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

})

exports = module.exports = router