const mongoose = require('mongoose')
const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')

const restaurantModel = require('../restaurantModel')
const userModel = require('../userModel')

const seedRestaurants = require('./restaurant.json').results
const seedUsers = require('./users.json').results



// generate a set of restaurants to the user with userId
async function generateRestaurants(userId, useRestaurantID) {

  // select some restaurants which matches useRestaurantID
  const restaurants = seedRestaurants.filter(restaurant => {
    return useRestaurantID.includes(restaurant.id)
  })

  // add userId to each selected restaurant
  restaurants.forEach(restaurant => restaurant.userId = userId)

  // create a document in database one by one
  return await restaurantModel.create(restaurants)

}



// create seed data and close db after creating
db.once('open', async () => {


  // define a set of requests which are promise-based 
  const requests = seedUsers.map((user) => {
    const { name, email, password, useRestaurantID } = user

    // check whether the email has been registered
    return userModel.findOne({ email })
      .then(user => {

        // if exists, then generate a set of restaurants for this email
        if (user) {
          const userId = user._id
          return generateRestaurants(userId, useRestaurantID)
        }

        // if not exist, then create a new user and generate a set of restaurants for the user
        return bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(password, salt))
          .then(hash => {
            return userModel.create({
              name,
              email,
              password: hash
            })
              .then(user => {
                const userId = user._id
                return generateRestaurants(userId, useRestaurantID)
              })
          })

      })
  })

  // execute as promise-based job to run requests
  Promise.all(requests)
    // when all requests have been done, then it close db connection
    .then(() => {
      console.log('All seed data have been built')
      db.close()
    })

})

