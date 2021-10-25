
// define express server
const express = require('express')
const app = express()

// define port
const port = 3500

app.get('/', (res, req) => {
  req.send('hi, this is a draft')
})

app.listen(port, () => {
  console.log(`The express server is running at port ${port}`)
})