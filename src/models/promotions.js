const aws = require('aws-sdk')
const mongoose = require('mongoose')
const { productionConnection, stagingConnection } = require('../database')

const s3 = new aws.S3()

const PromotionsSchema = new mongoose.Schema({
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
  id: Number,
  title: String,
  categorie: String,
  promo_url: String,
  avatarKey: String,
})

PromotionsSchema.virtual('avatar_url').get(function () {
  return `${process.env.APP_URL}/files/${this.Avatar}`
})

PromotionsSchema.pre('remove', function () {
  if (this.avatar) {
    return s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET,
        Key: this.avatarKey,
      })
      .promise()
  }
})

const Promotions = stagingConnection.model('Promotions', PromotionsSchema)
const PromotionsProduction = productionConnection.model('Promotions', PromotionsSchema)

module.exports = { Promotions, PromotionsProduction }
