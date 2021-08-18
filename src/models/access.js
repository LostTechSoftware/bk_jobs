const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const { productionConnection, stagingConnection } = require('../database')

const AccessSchema = new mongoose.Schema({
  email: String,
  name: String,
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
  },
  level: Number,
  password: String,
})

AccessSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 8)
})

const Access = stagingConnection.model('Access', AccessSchema)
const AccessProduction = productionConnection.model('Access', AccessSchema)

module.exports = { Access, AccessProduction }
