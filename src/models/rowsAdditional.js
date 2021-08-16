const aws = require('aws-sdk')
const mongoose = require('mongoose')
const { productionConnection, stagingConnection } = require('../database')

const s3 = new aws.S3()

const RowAdditionalSchema = new mongoose.Schema({
  title: String,
  mandatory: {
    type: Boolean,
    default: false,
  },
  numberSelect: Number,
  additional: [
    {
      title: String,
      price: Number,
      description: String,
      avatar: String,
      avatarKey: String,
    },
  ],
})

RowAdditionalSchema.virtual('avatar_url').get(function () {
  return `${process.env.APP_URL}/files/${this.Avatar}`
})

RowAdditionalSchema.pre('remove', function () {
  if (this.avatar) {
    return s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET,
        Key: this.avatarKey,
      })
      .promise()
  }
})

const RowAdditional = stagingConnection.model('RowAdditional', RowAdditionalSchema)
const RowAdditionalProduction = productionConnection.model('RowAdditional', RowAdditionalSchema)

module.exports = { RowAdditional, RowAdditionalProduction }
