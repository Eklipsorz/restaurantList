
// define express server, handlebars, restaurant data
const express = require('express')
const handlebarsModule = require('express-handlebars')
const restaurantList = require('./restaurant.json').results



const app = express()



// define engine setting by creating handlebars instance
const handlebarsInstance = handlebarsModule.create({
  layoutsDir: "views/layouts",
  extname: ".hbs",
  defaultLayout: "main"
})

// define port
const port = 3500

// set default views path
app.set('views', process.cwd() + '/views')

// register the engine function as .hbsa
app.engine('.hbs', handlebarsInstance.engine)

// set view engine in app to .hbs
app.set('view engine', '.hbs')


// set static file root
app.use('/', express.static('public'))


// define route for root, search, restaurants
app.get('/', (req, res) => {

  let restaurants = restaurantList
  let enableAlert = false

  res.render('index', { restaurants, enableAlert })
})


app.get('/restaurants/:id', (req, res) => {

  const reqId = req.params.id
  const targetRestaurant = restaurantList.find(restaurant => {
    return restaurant.id.toString() === reqId
  })

  res.render('show', { targetRestaurant })
})

// TODO: 簡化搜尋
app.get('/search', (req, res) => {


  const keyword = req.query.keyword.trim()

  const filteredRestaurants = restaurantList.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(keyword.toLowerCase())
  })

  let restaurants = filteredRestaurants.length ? filteredRestaurants : restaurantList
  let enableAlert = filteredRestaurants.length ? false : true

  res.render('index', { restaurants, keyword, enableAlert })
})



app.listen(port, () => {
  console.log(`The express server is running at port ${port}`)
})