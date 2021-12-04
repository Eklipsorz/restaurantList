// define express server, handlebars, restaurant data, 
// mongoose connection, express app
const express = require('express')
const handlebarsModule = require('express-handlebars')
const mongoose = require('mongoose')
const restaurantModel = require('./models/restaurantModel')

const methodOverride = require('method-override')
// store mongoose settingS and it's connection
const db = require('./config/connectMongoDB')

// define application's router 
const router = require('./routes')



// define a restaurant list
let restaurantList = ''

const app = express()

// define engine setting by creating handlebars instance
const handlebarsInstance = handlebarsModule.create({
  // set default path which stores layouts
  layoutsDir: "views/layouts",
  // set default global layout
  defaultLayout: "main",
  // set template file extension to .hbs
  extname: ".hbs",
  // add a helper for showing alert model
  helpers: {
    // if enableAlert is true, it show alert model according to message.
    // if enableAlert is false, it show nothing.
    alertModel: function (enableAlert, message) {


      if (!enableAlert) {
        return ''
      }

      // define alert model
      return `
      <script>
        Swal.fire({
            title:"${message.title}",
            text:"${message.text}",
            icon:"error",
            confirmButtonText:"確認",
        })
      </script>
      `
    }
  }
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

// set body parser for post message
app.use('/', express.urlencoded({ extended: true }))

app.use('/', methodOverride('_method'))

app.use('/', router)
// each query is not promise, so it need to add query.exec() or query.then()
// however, query.then() is also not really then in promise and each then()
// execute the query. These can execute the query multiple times. Therefore, 
// I chose query.exec() to transfer query to a real promise and use it's 
// then and catch syntax.




// define route for creation page
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})


// define route for adding restaurant
app.post('/restaurants', (req, res) => {

  // add a restaurant according to form data on creation page
  const newRestaurant = new restaurantModel(req.body)
  newRestaurant.save()
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))

})


// define route for restaurant detail with id
app.get('/restaurants/:id', (req, res) => {
  // get restaurant by reqId from request object 
  const reqId = req.params.id

  // find the restaurant by id and render
  restaurantModel.findById(reqId)
    .lean()
    .exec()
    .then((targetRestaurant) => res.render('show', { targetRestaurant }))
    .catch(error => console.log(error))


})

// define route for edit page
app.get('/restaurants/:id/edit', (req, res) => {

  const reqId = req.params.id

  // find the restaurant by id and render a edit page for it
  restaurantModel.findById(reqId)
    .lean()
    .exec()
    .then((targetRestaurant) => res.render('edit', { targetRestaurant }))
    .catch(error => console.log(error))
})


// define route for editing restaurant data on edit page
app.put('/restaurants/:id', (req, res) => {
  const reqId = req.params.id
  const targetRestaurant = req.body

  // find the restaurant by id and update it with the form data on edit page
  restaurantModel.findByIdAndUpdate(reqId, targetRestaurant)
    .exec()
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// define route for deleting a restaurant
app.delete('/restaurants/:id', (req, res) => {


  const reqId = req.params.id

  // find the restaurant by id and delete it
  restaurantModel.findByIdAndRemove(reqId)
    .exec()
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})



// start to listening at port 3500
app.listen(port, () => {
  console.log(`The express server is running at port ${port}`)
})

