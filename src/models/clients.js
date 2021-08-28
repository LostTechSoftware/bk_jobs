const mongoose = require('mongoose')
const { productionConnection, stagingConnection } = require('../database')

const ClientSchema = new mongoose.Schema({
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
  ExponentPushToken: {
    type: String,
    unique: true,
    default: '',
  },
})

const Client = stagingConnection.model('Client', ClientSchema)
const ClientProduction = productionConnection.model('Client', ClientSchema)

module.exports = { Client, ClientProduction }
