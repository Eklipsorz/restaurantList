const express = require('express')
const mongoose = require('mongoose')
const restaurantModel = require('../../models/restaurantModel')

const router = express.Router()

// define route for root
router.get('/', (req, res) => {

  // define a object which stores rendering settings 
  let ContentSetting = {
    // turn off alert model
    enableAlert: false
  }

  // find all restaurants and render
  restaurantModel.find({})
    .lean()
    .exec()
    .then(restaurants => {
      restaurantList = restaurants
      // render a page according via data and setting object
      res.render('index', { restaurants, ContentSetting })
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

  // get sort from search bar
  const sort = req.query.sort
  const sortObject = {}

  // determine how to sort
  switch (sort) {
    case 'a-to-z':
      sortObject.name_en = 'asc'
      break
    case 'z-to-a':
      sortObject.name_en = 'desc'
      break
    case 'few-to-many':
      sortObject.name = 'asc'
      break
    case 'many-to-few':
      sortObject.name = 'desc'
      break
    case 'category':
      sortObject.category = 'asc'
      break
    case 'location':
      sortObject.location = 'asc'
      break
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
    .sort(sortObject)
    .exec()
    .then(filteredRestaurants => {

      // if filteredRestaurants is empty, the system will render to origin view with a alert widget
      // if filteredRestaurants is not empty, the system will render to new view via search result
      let restaurants = filteredRestaurants.length ? filteredRestaurants : restaurantList

      // define a object which stores rendering settings for search result
      let ContentSetting = {
        // turn on alert model
        enableAlert: filteredRestaurants.length ? false : true,
        // define the message on alert model
        message: {
          title: '搜尋失敗',
          text: `找不到名為 ${originKeyword} 的餐廳，請更換名稱`
        },
        // search keyword
        keyword: originKeyword,
        // define sort for searching 
        sort
      }

      // render a page according via data and setting object
      res.render('index', { restaurants, ContentSetting })
    })
    .catch(error => console.log(error))

})

module.exports = router