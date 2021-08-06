const mongoose = require('../database')

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

const Notification = mongoose.model('Notification', NotificationSchema)

module.exports = Notification
