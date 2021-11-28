const mongoose = require('mongoose')
const restaurantModel = require('../restaurantModel')
const defaultData = require('./restaurant.json').results


const dbPort = 27017
const dbName = 'restaurantList'

mongoose.connect(`mongodb://localhost:${dbPort}/${dbName}`)
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', async () => {
  console.log('mongodb connected!')


  for (let index = 0; index < defaultData.length; index++) {

    // each task just call create command one by one and the execution of some 
    // commands might not be ended. It need to make them be synchronous task.
    await restaurantModel.create({
      name: defaultData[index].name,
      name_en: defaultData[index].name_en,
      category: defaultData[index].category,
      rating: defaultData[index].rating,
      description: defaultData[index].description,
      image: defaultData[index].image,
      phone: defaultData[index].phone,
      location: defaultData[index].location,
      google_map: defaultData[index].google_map
    })

  }

  db.close()

})

