const mongoose = require('mongoose')

const dbPort = 27017
const dbName = 'restaurantList'

mongoose.connect(`mongodb://localhost:${dbPort}/${dbName}`)
const db = mongoose.connection


db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

exports = module.exports = db