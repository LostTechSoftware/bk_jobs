const mongoose = require('mongoose')
const { productionConnection, stagingConnection } = require('../database')

const MenuSchema = new mongoose.Schema({
  rows: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Row',
    },
  ],
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
  },
  additional: [
    {
      title: String,
      price: Number,
    },
  ],
})

const Menu = stagingConnection.model('Menu', MenuSchema)
const MenuProduction = productionConnection.model('Menu', MenuSchema)

module.exports = { Menu, MenuProduction }
