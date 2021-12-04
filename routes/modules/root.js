const express = require('express')
const mongoose = require('mongoose')
const restaurantModel = require('../../models/restaurantModel')

const router = express.Router()

// define route for root
router.get('/', (req, res) => {

  // turn off alert model
  let enableAlert = false

  // find all restaurants and render
  restaurantModel.find({})
    .lean()
    .exec()
    .then(restaurants => {
      restaurantList = restaurants
      res.render('index', { restaurants, enableAlert })
    })
    .catch(error => console.log(error))
})



// define route for searching
router.get('/search', (req, res) => {

  // if user input nothing
  if (req.query.keyword === '') {
    res.redirect('/')
    return
  }

  // get origin keyword for showing message on the alert model
  const originKeyword = req.query.keyword
  // fetch keyword and trim additional spaces
  const keyword = originKeyword.trim().toLowerCase()

  const sortObject = {}

  switch (req.query.sort) {
    case 'a-to-z':
      sortObject.name_en = 1
      break
    case 'z-to-a':
      sortObject.name_en = -1
      break
    case 'category':
      sortObject.category = 1
      break
    case 'location':
      sortObject.location = 1
      break
  }
  console.log(sortObject)
  // if user input something, it try to find the restaurant with three fields
  // (name, name_en, category) and get the search result (called filteredRestaurants)
  restaurantModel.find({
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { category: { $regex: keyword, $options: 'i' } }
    ]
  })
    .lean()
    .sort(sortObject)
    .exec()
    .then(filteredRestaurants => {
      console.log(filteredRestaurants)
      // if filteredRestaurants is empty, the system will render to origin view with a alert widget
      // if filteredRestaurants is not empty, the system will render to new view via search result
      let restaurants = filteredRestaurants.length ? filteredRestaurants : restaurantList
      // turn on alert model
      let enableAlert = filteredRestaurants.length ? false : true
      // define the message on alert model
      let message = {
        title: '搜尋失敗',
        text: `找不到名為 ${originKeyword} 的餐廳，請更換名稱`
      }
      // render a page according search results
      res.render('index', { restaurants, enableAlert, message, originKeyword })
    })
    .catch(error => console.log(error))

})

module.exports = router