const express = require('express')
const mongoose = require('mongoose')
const restaurantModel = require('../../models/restaurantModel')

const router = express.Router()

// define route for creation page
router.get('/new', (req, res) => {
  res.render('new')
})


// define route for adding restaurant
router.post('/', (req, res) => {

  // add a restaurant according to form data on creation page
  const newRestaurant = new restaurantModel(req.body)
  newRestaurant.save()
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))

})



// define route for edit page
router.get('/:id/edit', (req, res) => {

  const reqId = req.params.id

  // find the restaurant by id and render a edit page for it
  restaurantModel.findById(reqId)
    .lean()
    .exec()
    .then((targetRestaurant) => res.render('edit', { targetRestaurant }))
    .catch(() => res.render('404'))
})


// define route for editing restaurant data on edit page
router.put('/:id', (req, res) => {

  const reqId = req.params.id
  const targetRestaurant = req.body

  // find the restaurant by id and update it with the form data on edit page
  restaurantModel.findByIdAndUpdate(reqId, targetRestaurant)
    .exec()
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})




// define route for restaurant detail with id
router.get('/:id', (req, res) => {

  // get restaurant by reqId from request object 
  const reqId = req.params.id

  // find the restaurant by id and render
  restaurantModel.findById(reqId)
    .lean()
    .exec()
    .then((targetRestaurant) => res.render('show', { targetRestaurant }))
    .catch(() => res.render('404'))


})

// define route for deleting a restaurant
router.delete('/:id', (req, res) => {

  const reqId = req.params.id

  // find the restaurant by id and delete it
  restaurantModel.findByIdAndRemove(reqId)
    .exec()
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})




module.exports = router



