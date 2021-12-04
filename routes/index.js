const express = require('express')
const router = express.Router()
const rootRoutes = require('./modules/root')
const restaurantsRoutes = require('./modules/restaurants')


router.use('/', rootRoutes)
router.use('/restaurants', restaurantsRoutes)

module.exports = router



