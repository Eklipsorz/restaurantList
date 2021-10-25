
// define express server
const express = require('express')
const app = express()

// define port
const port = 3500

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




app.get('/', (res, req) => {
  req.send('hi, this is a draft')
})

app.listen(port, () => {
  console.log(`The express server is running at port ${port}`)
})