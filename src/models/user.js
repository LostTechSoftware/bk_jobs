const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const aws = require('aws-sdk')
const { productionConnection, stagingConnection } = require('../database')
const PointSchema = require('./utils/PointSchema')

const s3 = new aws.S3()

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
  },
  avatar: String,
  avatarKey: String,
  password: {
    type: String,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  confirmation: {
    type: Boolean,
    default: false,
  },
  telephone: {
    type: Number,
    unique: false,
    required: false,
  },
  complement: String,
  city: String,
  state: String,
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  numberResetToken: {
    type: String,
    select: false,
  },
  numberResetExpires: {
    type: Date,
    select: false,
  },
  ExponentPushToken: {
    type: String,
    default: '',
  },
  DevicePushToken: {
    type: String,
    default: '',
  },
  customer: String,
  cards: [
    {
      last4Numbers: Number,
      flag: String,
      cardName: String,
      expiresMonth: Number,
      expiresYear: Number,
      cardId: String,
    },
  ],
  wallet: {
    type: Number,
    default: 0,
  },
  address: [
    {
      street: String,
      Number,
      neighborhood: String,
      title: String,
      complement: String,
      reference: String,
      customer: String,
      city: String,
      location: {
        type: PointSchema,
        index: '2dsphere',
      },
    },
  ],
  transactions: [
    {
      title: String,
      date: {
        type: Date,
        default: Date.now,
      },
      value: Number,
      add: Boolean,
    },
  ],
  punctuation: {
    type: Number,
    default: 0,
  },
  appleId: String,
  connected: Boolean,
  socketId: String,
  gender: String,
  googleAccessToken: String,
  googleId: String,
})

UserSchema.virtual('avatar_url').get(function () {
  return `${process.env.APP_URL}/files/${this.Avatar}`
})

UserSchema.pre('remove', function () {
  return s3
    .deleteObject({
      bucket: process.env.AWS_BUCKET,
      avatar: this.avatar,
    })
    .promise()
})

UserSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 8)
})

const User = stagingConnection.model('User', UserSchema)
const UserProduction = productionConnection.model('User', UserSchema)

module.exports = { User, UserProduction }
