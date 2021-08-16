const mongoose = require('mongoose')
const { productionConnection, stagingConnection } = require('../database')

const PaymentsSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
  },
  creditCards: [
    {
      flag: {
        type: String,
        default: 'Mastercard',
      },
      active: {
        type: Boolean,
        default: false,
      },
    },
    {
      flag: {
        type: String,
        default: 'Redeshop',
      },
      active: {
        type: Boolean,
        default: false,
      },
    },
    {
      flag: {
        type: String,
        default: 'BNDES',
      },
      active: {
        type: Boolean,
        default: false,
      },
    },
    {
      flag: {
        type: String,
        default: 'Sorocred',
      },
      active: {
        type: Boolean,
        default: false,
      },
    },
    {
      flag: {
        type: String,
        default: 'Elo',
      },
      active: {
        type: Boolean,
        default: false,
      },
    },
    {
      flag: {
        type: String,
        default: 'American Express',
      },
      active: {
        type: Boolean,
        default: false,
      },
    },
    {
      flag: {
        type: String,
        default: 'Dinnersclub',
      },
      active: {
        type: Boolean,
        default: false,
      },
    },
    {
      flag: {
        type: String,
        default: 'Aura',
      },
      active: {
        type: Boolean,
        default: false,
      },
    },
    {
      flag: {
        type: String,
        default: 'Hipercard',
      },
      active: {
        type: Boolean,
        default: false,
      },
    },
    {
      flag: {
        type: String,
        default: 'VISA',
      },
      active: {
        type: Boolean,
        default: false,
      },
    },
  ],
  debitCards: [
    {
      flag: {
        type: String,
        default: 'Mastercard/Maestro',
      },
      active: {
        type: Boolean,
        default: false,
      },
    },
    {
      flag: {
        type: String,
        default: 'Redeshop',
      },
      active: {
        type: Boolean,
        default: false,
      },
    },
    {
      flag: {
        type: String,
        default: 'Elo',
      },
      active: {
        type: Boolean,
        default: false,
      },
    },
    {
      flag: {
        type: String,
        default: 'VISA Electron',
      },
      active: {
        type: Boolean,
        default: false,
      },
    },
  ],
  online: {
    type: Boolean,
    default: false,
  },
})

const Payments = stagingConnection.model('Payments', PaymentsSchema)
const PaymentsProduction = productionConnection.model('Payments', PaymentsSchema)

module.exports = { Payments, PaymentsProduction }
