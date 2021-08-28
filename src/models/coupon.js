const mongoose = require('mongoose')
const { productionConnection, stagingConnection } = require('../database')

const CouponSchema = new mongoose.Schema({
  price: Number,
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
  expiresIn: {
    type: Date,
  },
  minPrice: Number,
  token: String,
  max: Number,
  priceCouponUsed: {
    type: Number,
    default: 0,
  },
  priceCouponLimit: Number,
  priceLimit: Number,
  global: {
    type: Boolean,
    default: true,
  },
  itsToFirstOrder: {
    type: Boolean,
    default: false,
  },
  itsToOneRealCoupon: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  users: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  ExponentPushTokens: [
    {
      type: String,
    },
  ],
  IPs: [
    {
      type: String,
    },
  ],
})

const Coupon = stagingConnection.model('Coupon', CouponSchema)
const CouponProduction = productionConnection.model('Coupon', CouponSchema)

module.exports = { Coupon, CouponProduction }
