const bcrypt = require('bcryptjs')
const aws = require('aws-sdk')
const mongoose = require('../database')

const s3 = new aws.S3()
const PointSchema = require('./utils/PointSchema')

const RestaurantSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: {
    type: String,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  starTotal: {
    type: Number,
    default: 0,
  },
  ExponentPushToken: String,
  street: String,
  Number,
  star: {
    type: Number,
    default: 0,
  },
  feeType: {
    type: String,
    default: 'Fixed',
  },
  fee: Number,
  km1: Number,
  km3: Number,
  km5: Number,
  km7: Number,
  km9: Number,
  neighborhood: String,
  telephone: Number,
  complement: String,
  avaliationsCount: {
    type: Number,
    default: 0,
  },
  city: String,
  feeMedia: Number,
  avatar: String,
  avatarKey: String,
  classd: [
    {
      title: String,
    },
  ],
  removeOption: Boolean,
  state: String,
  payOnline: Boolean,
  payCard: Boolean,
  payCash: Boolean,
  delay: Number,
  delayRemove: {
    type: Number,
    default: 40,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  menu: {
    type: mongoose.Schema.ObjectId,
    ref: 'Menu',
  },
  open: {
    type: Boolean,
    default: false,
  },
  saleDay: {
    type: Number,
    default: 0,
    select: false,
  },
  nextPayment: {
    type: Date,
    default: 0,
    select: false,
  },
  CpfCnpj: {
    type: String,
    select: false,
  },
  uf: String,
  postalCode: String,
  bloqued: Boolean,
  favorite: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  socketId: String,
  receipt: [
    {
      value: {
        type: Number,
        select: false,
      },
      receiptId: {
        type: String,
        select: false,
      },
      date: {
        type: Date,
        select: false,
      },
      url: {
        type: String,
        select: false,
      },
    },
  ],
  value: {
    type: Number,
    default: 0,
    select: false,
  },
  saleMonth: {
    type: Number,
    default: 0,
    select: false,
  },
  ordersMonthCount: {
    type: Number,
    default: 0,
    select: false,
  },
  feeFoodZilla: Number,
  couponValue: {
    type: Number,
    default: 0,
    select: false,
  },
  saleOnline: {
    type: Number,
    default: 0,
    select: false,
  },
  accountId: String,
  customer: String,
  location: {
    type: PointSchema,
    index: '2dsphere',
  },
  thumb: {
    type: String,
    default: 'https://serverem.s3.us-east-2.amazonaws.com/Foto-Shruti-Dadwal-Unsplash_capa-delivery.jpg',
  },
  thumbKey: String,
  hoursOpened: {
    type: Number,
    default: 0,
  },
  connected: Boolean,
  published: {
    type: Boolean,
    default: false,
  },
  bio: {
    type: String,
    default: 'Usando foodzilla, a melhor plataforma de delivery para você',
  },
  slug: String,
  isDisconnect: {
    type: Boolean,
    default: false,
  },
  openAutomaticaly: {
    type: Boolean,
    default: true,
  },
  webNotificationToken: String,
})

RestaurantSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 8)
})

RestaurantSchema.virtual('avatar_url').get(function () {
  return `${process.env.APP_URL}/files/${this.Avatar}`
})

RestaurantSchema.pre('remove', function () {
  return s3
    .deleteObject({
      Bucket: process.env.AWS_BUCKET,
      avatar: this.avatar,
    })
    .promise()
})

const Restaurant = mongoose.model('Restaurant', RestaurantSchema)

module.exports = Restaurant
