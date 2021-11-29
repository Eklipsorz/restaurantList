
// define express server, handlebars, restaurant data, express app
const express = require('express')
const handlebarsModule = require('express-handlebars')
const mongoose = require('mongoose')
const restaurantModel = require('./models/restaurantModel')
// 
const restaurantList = require('./restaurant.json').results
const app = express()

// define engine setting by creating handlebars instance
const handlebarsInstance = handlebarsModule.create({
  // set default path which stores layouts
  layoutsDir: "views/layouts",
  // set default global layout
  defaultLayout: "main",
  // set template file extension to .hbs
  extname: ".hbs"
})

// define port
const port = 3500

// define setting of database
const dbPort = 27017
const dbName = 'restaurantList'


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

mongoose.connect(`mongodb://localhost:${dbPort}/${dbName}`)
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', async () => {
  console.log('mongodb connected!')
})







// define route for root
app.get('/', (req, res) => {

  let enableAlert = false
  restaurantModel.find({})
    .lean()
    .exec()
    .then(restaurants => res.render('index', { restaurants, enableAlert }))
    .catch(error => console.log(error))
})

// define route for adding restaurant
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants', (req, res) => {
  console.log("received")
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


// define route for deleting a restaurant
app.post('/restaurants/:id/delete', (req, res) => {
  console.log(req.body)
})



// define route for searching
app.get('/search', (req, res) => {

  // fetch keyword and trim additional spaces
  const keyword = req.query.keyword.trim()

  if (keyword === '') {
    res.redirect('/')
    return
  }


  // find a set of restaurants by keyword and put them into filteredRestaurants
  // filteredRestaurants represents search result
  const filteredRestaurants = restaurantList.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(keyword.toLowerCase())
  })


  // if filteredRestaurants is empty, the system will render to origin view with a alert widget
  // if filteredRestaurants is not empty, the system will render to new view via search result
  let restaurants = filteredRestaurants.length ? filteredRestaurants : restaurantList

  // enable alert widget to remind user.
  // true means a alert tell us the system find nothing by keyword.
  // false means nothing happened .
  let enableAlert = filteredRestaurants.length ? false : true


  // render with index.hbs, search results, keyword, enableAlert which enables alert widget to remind user
  res.render('index', { restaurants, keyword, enableAlert })
})


// start to listening at port 3500
app.listen(port, () => {
  console.log(`The express server is running at port ${port}`)
})
