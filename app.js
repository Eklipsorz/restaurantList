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


// start to listening at port 3500
app.listen(port, () => {
  console.log(`The express server is running at port ${port}`)
})

