const mongoose = require('../database')

const PaymentFlowsSchema = new mongoose.Schema({
  referenceMonth: { type: Number, default: 0 },
  feeFoodZilla: { type: Number, default: 0 },
  couponsSales: { type: Number, default: 0 },
  sales: { type: Number, default: 0 },
  boosterInvestiments: { type: Number, default: 0 },
  parcialPayed: { type: Number, default: 0 },
  otherRates: [{ rate: String, rateDescription: String, rateValue: Number }],
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
  },
  paid: { type: Boolean, default: false },
})

const PaymentFlows = mongoose.model('PaymentFlows', PaymentFlowsSchema)

module.exports = PaymentFlows
