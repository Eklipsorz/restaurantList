
// define express server, handlebars, restaurant data, express app
const express = require('express')
const handlebarsModule = require('express-handlebars')
const mongoose = require('mongoose')
const restaurantModel = require('./models/restaurantModel')
const db = require('./config/connectMongoDB')

const restaurantList = require('./restaurant.json').results


const app = express()

// define engine setting by creating handlebars instance
const handlebarsInstance = handlebarsModule.create({
  // set default path which stores layouts
  layoutsDir: "views/layouts",
  // set default global layout
  defaultLayout: "main",
  // set template file extension to .hbs
  extname: ".hbs",

  helpers: {
    alertModel: function (enableAlert, message) {
      if (!enableAlert) {
        return ''
      }

      return `
        Swal.fire({
            title:"${message.title}",
            text:"${message.text}",
            icon:"error",
            confirmButtonText:"確認",
        })
      `
    }
  }
})


// define port
const port = 3600


// set default views path
app.set('views', process.cwd() + '/views')

// register the engine function as .hbs
app.engine('.hbs', handlebarsInstance.engine)

// set view engine in app to .hbs
app.set('view engine', '.hbs')


// set static file root
app.use('/', express.static('public'))

// set body parser for post message
app.use('/', express.urlencoded({ extended: true }))



// define route for root
app.get('/', (req, res) => {

  let enableAlert = false
  restaurantModel.find({})
    .lean()
    .exec()
    .then(restaurants => res.render('index', { restaurants, enableAlert }))
    .catch(error => console.log(error))
})

// define route for showing form page
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})


// define route for adding restaurant
app.post('/restaurants', (req, res) => {

  const newRestaurant = new restaurantModel(req.body)

  newRestaurant.save()
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))

})


// define route for restaurant detail with id
app.get('/restaurants/:id', (req, res) => {
  // get restaurant by reqId from request object 
  const reqId = req.params.id

  restaurantModel.findById(reqId)
    .lean()
    .exec()
    .then((targetRestaurant) => res.render('show', { targetRestaurant }))
    .catch(error => console.log(error))


})

// define route for showing edit page
app.get('/restaurants/:id/edit', (req, res) => {

  const reqId = req.params.id

  restaurantModel.findById(reqId)
    .lean()
    .exec()
    .then((targetRestaurant) => res.render('edit', { targetRestaurant }))
    .catch(error => console.log(error))
})


// define route for editing restaurant data 
app.post('/restaurants/:id/edit', (req, res) => {
  const reqId = req.params.id
  const targetRestaurant = req.body

  restaurantModel.findByIdAndUpdate(reqId, targetRestaurant)
    .exec()
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// define route for deleting a restaurant
app.post('/restaurants/:id/delete', (req, res) => {

  const reqId = req.params.id
  restaurantModel.findByIdAndRemove(reqId)
    .exec()
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})



// define route for searching
app.get('/search', (req, res) => {

  // fetch keyword and trim additional spaces
  const originKeyword = req.query.keyword
  const keyword = originKeyword.trim().toLowerCase()

  if (keyword === '') {
    res.redirect('/')
    return
  }

  restaurantModel.find({
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { name_en: { $regex: keyword, $options: 'i' } },
      { category: { $regex: keyword, $options: 'i' } }
    ]
  })
    .lean()
    .exec()
    .then(filteredRestaurants => {
      let restaurants = filteredRestaurants.length ? filteredRestaurants : restaurantList
      let enableAlert = filteredRestaurants.length ? false : true
      let message = {
        title: '搜尋失敗',
        text: `找不到名為 ${originKeyword} 的餐廳，請更換名稱`
      }

      res.render('index', { restaurants, enableAlert, message })
    })
    .catch(error => console.log(error))



  // find a set of restaurants by keyword and put them into filteredRestaurants
  // filteredRestaurants represents search result
  // const filteredRestaurants = restaurantList.filter(restaurant => {
  //   return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) ||
  //     restaurant.category.toLowerCase().includes(keyword.toLowerCase())
  // })


  // if filteredRestaurants is empty, the system will render to origin view with a alert widget
  // if filteredRestaurants is not empty, the system will render to new view via search result
  // let restaurants = filteredRestaurants.length ? filteredRestaurants : restaurantList

  // enable alert widget to remind user.
  // true means a alert tell us the system find nothing by keyword.
  // false means nothing happened .
  // let enableAlert = filteredRestaurants.length ? false : true


  // render with index.hbs, search results, keyword, enableAlert which enables alert widget to remind user
  // res.render('index', { restaurants, keyword, enableAlert })
})


// start to listening at port 3500
app.listen(port, () => {
  console.log(`The express server is running at port ${port}`)
})

