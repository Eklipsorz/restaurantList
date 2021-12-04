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

  // get origin keyword for showing message on the alert model
  const originKeyword = req.query.keyword
  // fetch keyword and trim additional spaces
  const keyword = originKeyword.trim().toLowerCase()


  // if user input nothing
  if (keyword === '') {
    res.redirect('/')
    return
  }

  // if user input something, it try to find the restaurant with three fields
  // (name, name_en, category) and get the search result (called filteredRestaurants)
  restaurantModel.find({
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { category: { $regex: keyword, $options: 'i' } }
    ]
  })
    .lean()
    .exec()
    .then(filteredRestaurants => {
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
      res.render('index', { restaurants, enableAlert, message })
    })
    .catch(error => console.log(error))

})

module.exports = router