const mongoose = require('mongoose')
const { productionConnection, stagingConnection } = require('../database')

const CategoriesSchema = new mongoose.Schema({
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
  title: String,
  categorie_url: String,
})

const Categories = stagingConnection.model('Categories', CategoriesSchema)
const CategoriesProduction = productionConnection.model('Categories', CategoriesSchema)

module.exports = { Categories, CategoriesProduction }
