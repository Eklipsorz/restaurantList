const express = require('express')
const router = express.Router()
const rootRoutes = require('./modules/root')
const usersRoutes = require('./modules/users')
const restaurantsRoutes = require('./modules/restaurants')


// bind rootRoutes to /users
router.use('/users', usersRoutes)

// bind rootRoutes to /restaurants
router.use('/restaurants', restaurantsRoutes)

// bind rootRoutes to /
router.use('/', rootRoutes)

module.exports = router



