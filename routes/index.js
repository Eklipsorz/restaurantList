const express = require('express')
const router = express.Router()

const authenticator = require('../middleware/auth')

const rootRoutes = require('./modules/root')
const authRoutes = require('./modules/auth')
const usersRoutes = require('./modules/users')
const restaurantsRoutes = require('./modules/restaurants')


// bind rootRoutes to /users
router.use('/users', usersRoutes)

// bind authRoutes to /auth
router.use('/auth', authRoutes)

// bind rootRoutes to /restaurants
router.use('/restaurants', authenticator, restaurantsRoutes)

// bind rootRoutes to /
router.use('/', authenticator, rootRoutes)

module.exports = router



