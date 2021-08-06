const mongoose = require('../database')

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

const City = mongoose.model('City', CitySchema)

module.exports = City
