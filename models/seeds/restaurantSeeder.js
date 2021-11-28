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



async function createDBData(dataSet, length) {

  for (let index = 0; index < length; index++) {

    restaurantModel.create({
      name: dataSet[index].name,
      name_en: dataSet[index].name_en,
      category: dataSet[index].category,
      rating: dataSet[index].rating,
      description: dataSet[index].description,
      image: dataSet[index].image,
      phone: dataSet[index].phone,
      location: dataSet[index].location,
      google_map: dataSet[index].google_map
    })

  }
}


db.once('open', async () => {
  console.log('mongodb connected!')


  for (let index = 0; index < defaultData.length; index++) {

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

