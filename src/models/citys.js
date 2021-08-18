const mongoose = require('mongoose')
const { productionConnection, stagingConnection } = require('../database')

const CitySchema = new mongoose.Schema({
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
  city_Name: String,
  city_request: String,
  neighborhoods: [
    {
      Name: String,
    },
  ],
  revenues: {
    type: Number,
    default: 0,
  },
  franchisee: {
    type: mongoose.Schema.ObjectId,
    ref: 'Franchisees',
  },
})

const City = stagingConnection.model('City', CitySchema)
const CityProduction = productionConnection.model('City', CitySchema)

module.exports = { City, CityProduction }
