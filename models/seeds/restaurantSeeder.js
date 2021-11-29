const mongoose = require('mongoose')
const restaurantModel = require('../restaurantModel')
const defaultData = require('./restaurant.json').results
const db = require('../../config/connectMongoDB')

db.once('open', async () => {
  await restaurantModel.create(defaultData)
  console.log('The seed data have been built.')
  db.close()
})

