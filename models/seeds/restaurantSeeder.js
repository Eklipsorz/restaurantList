const mongoose = require('mongoose')
const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')

const restaurantModel = require('../restaurantModel')
const userModel = require('../userModel')

const seedRestaurants = require('./restaurant.json').results
const seedUsers = require('./users.json').results


async function generateRestaurants(userId, useRestaurantID) {

  const restaurants = seedRestaurants.filter(restaurant => {
    return useRestaurantID.includes(restaurant.id)
  })

  restaurants.forEach(restaurant => restaurant.userId = userId)

  return await restaurantModel.create(restaurants)

}



// create seed data and close db
db.once('open', async () => {


  const requests = seedUsers.map((user) => {
    const { name, email, password, useRestaurantID } = user

    return userModel.findOne({ email })
      .then(user => {

        if (user) {
          const userId = user._id
          return generateRestaurants(userId, useRestaurantID)
        }

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

  Promise.all(requests)
    .then(() => {
      console.log('All seed data have been built')
      db.close()
    })



  // await restaurantModel.create(defaultData)
  // console.log('The seed data have been built.')
  // db.close()
})

