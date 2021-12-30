const mongoose = require('mongoose')
const Schema = mongoose.Schema


const userSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createAt: { type: Date, default: Date.now }
})


exports = module.exports = mongoose.model('user', userSchema)