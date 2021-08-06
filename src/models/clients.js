const mongoose = require('../database')

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

const Client = mongoose.model('Client', ClientSchema)

module.exports = Client
