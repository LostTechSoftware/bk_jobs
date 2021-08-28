const mongoose = require('mongoose')
const { productionConnection, stagingConnection } = require('../database')

const CouponChangeSchema = new mongoose.Schema({
  price: Number,
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
  value: Number,
  title: String,
  avatar: String,
  description2: String,
  description1: String,
})

const CouponChange = stagingConnection.model('CouponChange', CouponChangeSchema)
const CouponChangeProduction = productionConnection.model('CouponChange', CouponChangeSchema)

module.exports = { CouponChange, CouponChangeProduction }
