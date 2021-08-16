const mongoose = require('mongoose')
const { productionConnection, stagingConnection } = require('../database')

const RowSchema = new mongoose.Schema({
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
    },
  ],
  title: String,
  additional: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'RowAdditional',
    },
  ],
  paused: {
    type: Boolean,
    default: false,
  },
  anchor: {
    type: Number,
    default: 0,
  },
  pauseRemove: {
    type: Boolean,
    default: false,
  },
  index: {
    type: Number,
    default: 0,
  },
})

const Row = stagingConnection.model('Row', RowSchema)
const RowProduction = productionConnection.model('Row', RowSchema)

module.exports = { Row, RowProduction }
