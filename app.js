
// define express server, handlebars, restaurant data, express app
const express = require('express')
const handlebarsModule = require('express-handlebars')
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

// set default views path
app.set('views', process.cwd() + '/views')

// register the engine function as .hbs
app.engine('.hbs', handlebarsInstance.engine)

// set view engine in app to .hbs
app.set('view engine', '.hbs')


// set static file root
app.use('/', express.static('public'))


// define route for root
app.get('/', (req, res) => {

  // when receiving request, it sets values of two variable to default value
  let restaurants = restaurantList
  let enableAlert = false

  // render with raw restaurant data and enableAlert which disables alert widget 
  res.render('index', { restaurants, enableAlert })
})


// define route for restaurant detail with id
app.get('/restaurants/:id', (req, res) => {

  // get restaurant by reqId from request object 
  const reqId = req.params.id
  const targetRestaurant = restaurantList.find(restaurant => {
    return restaurant.id.toString() === reqId
  })

  // show detail of targetRestaurant
  res.render('show', { targetRestaurant })
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