const express = require('express')
const router = express.Router()
const rootRoutes = require('./modules/root')
const restaurantsRoutes = require('./modules/restaurants')



// bind rootRoutes to /restaurants
router.use('/restaurants', restaurantsRoutes)

// bind rootRoutes to /
router.use('/', rootRoutes)

module.exports = router



