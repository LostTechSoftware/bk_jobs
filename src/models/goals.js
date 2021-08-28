const mongoose = require('mongoose')
const { productionConnection, stagingConnection } = require('../database')

const GoalsSchema = new mongoose.Schema({
  objective: { type: Number, default: 0 },
  inTheMoment: { type: Number, default: 0 },
  salesInTheMoment: { type: Number, default: 0 },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
  },
})

const Goals = stagingConnection.model('Goals', GoalsSchema)
const GoalsProduction = productionConnection.model('Goals', GoalsSchema)

module.exports = { Goals, GoalsProduction }
