const mongoose = require('mongoose')
const Schema = mongoose.Schema


const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  name_en: {
    type: String
  },
  rating: {
    type: Double
  },
  google_map: {
    type: String
  }
})

module.exports = mongoose.model('restaurantList', restaurantSchema)