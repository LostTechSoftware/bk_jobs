const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const { productionConnection, stagingConnection } = require('../database')

const EmployeerSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    select: false,
  },
  twoFactorCode: {
    type: Number,
  },
  attemptCount: {
    type: Number,
    default: 0,
  },
  bloqued: {
    type: Boolean,
    default: false,
  },
  ipIsCreated: String,
})

EmployeerSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 8)
})

const Employeer = stagingConnection.model('Employeer', EmployeerSchema)
const EmployeerProduction = productionConnection.model('Employeer', EmployeerSchema)

module.exports = { Employeer, EmployeerProduction }
