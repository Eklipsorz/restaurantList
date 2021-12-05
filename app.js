// define express server, handlebars
const express = require('express')
const handlebarsModule = require('express-handlebars')

// load modules about mongodb, mongoose, mongoose model
const mongoose = require('mongoose')
const restaurantModel = require('./models/restaurantModel')
const db = require('./config/connectMongoDB')

// load third-part module (method-override)
const methodOverride = require('method-override')


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

  helpers: {

    // add a helper for showing alert model
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
    },
    // add a helper for showing default option
    // if selectOption is same as currentOption, that means currentOption is selected by user
    displayDefaultOption: function (selectedOption, currentOption) {
      console.log(selectedOption, currentOption)
      return selectedOption === currentOption ? 'selected' : ''
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

// set method-override module to get value via _method attribute
app.use('/', methodOverride('_method'))

// bind router to / 
app.use('/', router)

// start to listening at port 3500
app.listen(port, () => {
  console.log(`The express server is running at port ${port}`)
})

