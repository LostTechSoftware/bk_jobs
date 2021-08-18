const crypto = require('crypto')
const mongoose = require('mongoose')
const PointSchema = require('./utils/PointSchema')
const { productionConnection, stagingConnection } = require('../database')

const OrderSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  products: [
    {
      classd: String,
      title: String,
      paused: {
        type: Boolean,
        default: false,
      },
      description: String,
      price: Number,
      OldPrice: Number,
      city: String,
      favorite: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        },
      ],
      restaurant: {
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant',
      },
      avatar: String,
      promotion: {
        type: Boolean,
        default: false,
      },
      additional: [
        {
          title: String,
          mandatory: {
            type: Boolean,
            default: false,
          },
          numberSelect: Number,
          additional: [
            {
              title: String,
              quantidade: Number,
              price: Number,
              description: String,
              avatar: String,
            },
          ],
        },
      ],
      observation: String,
      quantidade: Number,
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  approved: {
    type: String,
    default: 'Aguardando aprovação',
  },
  reason: {
    type: String,
  },
  address: {
    street: String,
    Number,
    neighborhood: String,
    title: String,
    complement: String,
    reference: String,
    customer: String,
    location: {
      type: PointSchema,
      index: '2dsphere',
    },
  },
  completed: {
    type: Boolean,
    default: false,
  },
  canceled: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
    default: crypto.randomInt(111111, 999999),
  },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
  },
  payment_method: String,
  price: {
    type: Number,
    default: 0,
  },
  change: {
    type: Number,
    default: 0,
  },
  onTheWay: {
    type: Boolean,
    default: false,
  },
  rated: {
    type: Boolean,
    default: false,
  },
  arrived: {
    type: Boolean,
    default: false,
  },
  cancelClient: String,
  cancel: Boolean,
  coupon: {
    type: mongoose.Schema.ObjectId,
    ref: 'Coupon',
  },
  removeOption: Boolean,
  tip: {
    type: Number,
    default: 0,
  },
  realPrice: Number,
  star: Number,
  expiresIn: Date,
  chargeId: String,
  IP: String,
  status: {
    type: String,
    default: 'Aguardando aprovação',
  },
  couponUsed: Number,
  DeliveriedAt: Date,
})

const Order = stagingConnection.model('Order', OrderSchema)
const OrderProduction = productionConnection.model('Order', OrderSchema)

module.exports = { Order, OrderProduction }
