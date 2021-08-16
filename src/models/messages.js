const mongoose = require('mongoose')
const { productionConnection, stagingConnection } = require('../database')

const MessagesSchema = new mongoose.Schema({
  text: [
    {
      type: {
        type: String,
        default: 'text',
      },
      content: String,
      renderTime: {
        type: Boolean,
        default: true,
      },
      time: {
        type: String,
        default: new Date(),
      },
      sendStatus: {
        type: Number,
        default: 1,
      },
      targetId: String,
      chatInfo: {
        id: String,
        avatar: {
          type: String,
          default: 'https://foodzilla.com.br/assets/images/favicon.png',
        },
        nickName: {
          type: String,
          default: 'Usuario',
        },
      },
    },
  ],
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
})

const Messages = stagingConnection.model('Messages', MessagesSchema)
const MessagesProduction = productionConnection.model('Messages', MessagesSchema)

module.exports = { Messages, MessagesProduction }
