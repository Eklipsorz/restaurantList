const express = require('express')
const router = express.Router()
const rootRoutes = require('./modules/root')
const restaurantsRoutes = require('./modules/restaurants')

// bind rootRoutes to /
router.use('/', rootRoutes)

// bind rootRoutes to /restaurants
router.use('/restaurants', restaurantsRoutes)

module.exports = router



