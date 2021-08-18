const mongoose = require('mongoose')
const { productionConnection, stagingConnection } = require('../database')

const NotificationSchema = new mongoose.Schema({
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
  title: String,
  body: String,
  send: {
    type: Number,
    default: 0,
  },
  convert: {
    type: Number,
    default: 0,
  },
  schedule: Date,
  tokens: [],
  sended: {
    type: Boolean,
    default: false,
  },
})

const Notification = stagingConnection.model('Notification', NotificationSchema)
const NotificationProduction = productionConnection.model('Notification', NotificationSchema)

module.exports = { Notification, NotificationProduction }
