const mongoose = require('mongoose')
const { productionConnection, stagingConnection } = require('../database')

const FranchiseesSchema = new mongoose.Schema({
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
  Franchisees_Name: String,
  Franchisees_email: String,
  percentage: Number,
  city: {
    type: mongoose.Schema.ObjectId,
    ref: 'City',
  },
})

const Franchisees = stagingConnection.model('Franchisees', FranchiseesSchema)
const FranchiseesProduction = productionConnection.model('Franchisees', FranchiseesSchema)

module.exports = { Franchisees, FranchiseesProduction }
