// define express server, handlebars
const express = require('express')
const handlebarsModule = require('express-handlebars')

// load modules about mongodb, mongoose, mongoose model
const mongoose = require('mongoose')
const restaurantModel = require('./models/restaurantModel')
const db = require('./config/mongoose')


// load session module
const session = require('express-session')



// load third-part module (method-override)
const methodOverride = require('method-override')

// load flash message module
const flash = require('connect-flash')

// define application's router 
const router = require('./routes')


// load dotenv module
if (process.env.NODE_ENV != 'production') {
  require('dotenv').config()
}

//

const usePassport = require('./config/passport')



// define port
const port = process.env.PORT || 3000

// define a restaurant list
let restaurantList = ''

const app = express()

// define engine setting by creating handlebars instance
const handlebarsInstance = handlebarsModule.create({
  // set default path which stores layouts
  layoutsDir: "views/layouts",
  // set default global layout
  defaultLayout: "main",
  // set default path which stores partials
  partialDir: "views/partials",
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
      return selectedOption === currentOption ? 'selected' : ''
    }
  }
})





// set default views path
app.set('views', process.cwd() + '/views')

// register the engine function as .hbs
app.engine('.hbs', handlebarsInstance.engine)

// set view engine in app to .hbs
app.set('view engine', '.hbs')

console.log(process.env.SESSION_SECRET)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))


// set static file root
app.use('/', express.static('public'))

// set body parser for post message
app.use('/', express.urlencoded({ extended: true }))

// set method-override module to get value via _method attribute
app.use('/', methodOverride('_method'))


usePassport(app)
app.use(flash())

app.use('/', (req, res, next) => {

  res.locals.isAuthenticated = req.isAuthenticated
  res.locals.user = req.user
  res.locals.loginFailure_message = req.flash('error')
  res.locals.success_message = req.flash('success_message')
  res.locals.warning_message = req.flash('warning_message')



  next()
})

// bind router to / 
app.use('/', router)

// start to listening at port 3500
app.listen(port, () => {
  console.log(`The express server is running at port ${port}`)
})

