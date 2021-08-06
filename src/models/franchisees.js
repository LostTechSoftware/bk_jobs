const mongoose = require('../database')

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

const Franchisees = mongoose.model('Franchisees', FranchiseesSchema)

module.exports = Franchisees
