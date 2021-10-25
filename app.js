
// define express server
const express = require('express')
const app = express()

// define port
const port = 3500

// define restaurant data
const restaurantList = require('./restaurant.json')
// define view engine
const viewEngine = require('express-handlebars').create({
  layoutsDir: "views/layouts",
  extname: ".handlebars",
  defaultLayout: "main"
})

// create a engine instance to the express server

// bind the engine to the file type
app.engine('handlebars', viewEngine.engine)

// set default views path
app.set('views', process.cwd() + '/views')

// set engine to handlebars
app.set('view engine', 'handlebars')

// set static file root

app.use('/', express.static('public'))


app.get('/', (req, res) => {
  // console.log('hi')

  res.render('index', { restaurant: restaurantList.results })
})

app.get('/restaurants/:id', (req, res) => {

  const reqId = req.params.id
  const filteredRestaurant = restaurantList.results.filter(restaurant => {
    return restaurant.id === reqId
  })
  res.render('show', { restaurant: filteredRestaurant })
})

app.listen(port, () => {
  console.log(`The express server is running at port ${port}`)
})