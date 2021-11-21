
// define express server, handlebars, restaurant data
const express = require('express')
const handlebarsModule = require('express-handlebars')
const restaurantList = require('./restaurant.json')

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
  res.render('index', { restaurant: restaurantList.results })
})


app.get('/restaurants/:id', (req, res) => {

  const reqId = req.params.id
  const targetRestaurant = restaurantList.results.find(restaurant => {
    return restaurant.id.toString() === reqId
  })

  res.render('show', { restaurant: targetRestaurant })
})

// TODO: 簡化搜尋
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const filteredRestaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(keyword.toLowerCase())
  })

  res.render('index', { restaurant: filteredRestaurants })
})



app.listen(port, () => {
  console.log(`The express server is running at port ${port}`)
})