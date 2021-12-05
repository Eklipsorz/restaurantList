const express = require('express')
const mongoose = require('mongoose')
const restaurantModel = require('../../models/restaurantModel')
let restaurantList = []
const router = express.Router()

// define a route for searching or viewing all restaurants
// use regex to fetch / and /search
router.get(/^\/*\/$|^\/search/, (req, res) => {


  // define original keyword from search bar
  let originKeyword = ''

  // define keyword result after handling trim() and toLowerCase()
  let keyword = ''

  // define a setting object which define how to sort
  const sortSetting = {}

  // define a setting object which define what collcation is 
  const collationSetting = {
    locale: 'en'
  }

  // define where query inside MongoDB
  let where = {}

  // if user input something
  if (originKeyword = req.query.keyword) {

    // fetch keyword and trim additional spaces
    keyword = originKeyword.trim().toLowerCase()

    // if user input something in which all characters are spaces
    if (keyword === '') {
      // just redirect to index
      res.redirect('/')
      return
    }



    // determine how to sort and what collation is
    let [sortName, sortValue, locale] = req.query.sort.split('-')
    sortSetting[sortName] = sortValue
    collationSetting['locale'] = locale

    // determine what where query is 
    where = {
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } }
      ]
    }
  }

  // use the above settings to find something user want to see
  restaurantModel.find(where)
    .lean()
    .collation(collationSetting)
    .sort(sortSetting)
    .then(restaurants => {

      // when user just request a route for /, then the system stores all restaurants
      // user can see and these are used to backup for searching
      if (req.url === '/') {
        restaurantList = restaurants
      }

      // check whether user is searching
      const isSearching = Boolean(keyword)

      // define a setting object which can enable alert modal and restore search bar
      // it has the following properties: enableAlert、keyword、message、sort
      // enableAlert: boolean 
      //    if it's false, the system turn off the alert modal
      //    if it's true,  the system turn on the alert modal
      // keyword: string
      //    it stores original keyword user input 
      // message: object
      //    it define what display inside the alert modal is
      //    it also has two properties: title and text
      //        title: string
      //            define a title on the modal
      //        text: string
      //            define content in the modal
      // sort: string
      //    it deine how to sort some restaurants user want search
      let ContentSetting = {

        enableAlert: false
      }

      // if user is searching
      if (isSearching) {
        ContentSetting['keyword'] = originKeyword
        ContentSetting['sort'] = req.query.sort

        // if user is searching and search result is nothing
        // the system show the alert modal to remind user and restore search bar
        if (restaurants.length === 0) {
          ContentSetting['enableAlert'] = true
          ContentSetting['message'] = {
            title: '搜尋失敗',
            text: `找不到名為 ${originKeyword} 的餐廳，請更換名稱`
          }
          ContentSetting['sort'] = 'name-asc-en'
          restaurants = restaurantList
        }
      }


      // render a page according via data and setting object
      res.render('index', { restaurants, ContentSetting })
    })
    .catch(error => console.log(error))

})

// define a route for not-found problem
router.use('/', function (req, res) {
  res.status(404)
  res.format({
    html: function () {
      res.render('404')
    }
  })
})

module.exports = router