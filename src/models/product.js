const aws = require('aws-sdk')
const mongoose = require('mongoose')
const { productionConnection, stagingConnection } = require('../database')

const s3 = new aws.S3()

const ProductSchema = new mongoose.Schema({
  title: String,
  paused: {
    type: Boolean,
    default: false,
  },
  description: String,
  price: Number,
  OldPrice: Number,
  city: String,
  avatarKey: String,
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
  ordersCount: {
    default: 0,
    type: Number,
  },
  schedule: Boolean,
  segunda: Boolean,
  terca: Boolean,
  quarta: Boolean,
  quinta: Boolean,
  sexta: Boolean,
  sabado: Boolean,
  domingo: Boolean,
  pauseRemove: {
    type: Boolean,
    default: false,
  },
  labels: [],
})

ProductSchema.virtual('avatar_url').get(function () {
  return `${process.env.APP_URL}/files/${this.Avatar}`
})

ProductSchema.pre('remove', function () {
  if (this.avatar) {
    return s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET,
        Key: this.avatarKey,
      })
      .promise()
  }
})

const Product = stagingConnection.model('Product', ProductSchema)
const ProductProduction = productionConnection.model('Product', ProductSchema)

module.exports = { Product, ProductProduction }
