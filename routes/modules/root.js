const express = require('express')
const mongoose = require('mongoose')
const restaurantModel = require('../../models/restaurantModel')
let restaurantList = []
const router = express.Router()


router.get(/^\/(search|)/, (req, res, next) => {


  let where = {}
  const sortObject = {}
  let sort = ''
  let originKeyword = ''
  let keyword = ''


  if (originKeyword = req.query.keyword) {

    // fetch keyword and trim additional spaces
    keyword = originKeyword.trim().toLowerCase()

    if (keyword === '') {
      res.redirect('/')
      return
    }
    // get sort from search bar
    sort = req.query.sort


    // determine how to sort
    let [sortName, sortValue, locale] = sort.split('-')
    sortObject[sortName] = sortValue

    where = {
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } }
      ]
    }
  }

  restaurantModel.find(where)
    .lean()
    .collation({
      locale: 'en'
    })
    .sort(sortObject)
    .exec()
    .then(restaurants => {

      if (req.url === '/') {
        restaurantList = restaurants
      }

      const isSearching = Boolean(keyword)


      let ContentSetting = {
        enableAlert: false
      }


      if (isSearching) {
        ContentSetting['keyword'] = originKeyword
        ContentSetting['sort'] = sort

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

router.use(function (req, res, next) {
  res.status(404);

  res.format({
    html: function () {
      res.render('404', { url: req.url })
    },
    json: function () {
      res.json({ error: 'Not found' })
    },
    default: function () {
      res.type('txt').send('Not found')
    }
  })
});

module.exports = router