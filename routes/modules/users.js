const mongoose = require('mongoose')
const express = require('express')

const router = express.Router()



router.get('/register', (req, res) => {
  res.render('register', { layout: 'register' })
})

router.post('/register', (req, res) => {

})

router.get('/login', (req, res) => {

})
router.post('/login', (req, res) => {

})


router.get('/logout', (req, res) => {

})

exports = module.exports = router