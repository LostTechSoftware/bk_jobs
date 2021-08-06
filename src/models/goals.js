const mongoose = require('../database')

const GoalsSchema = new mongoose.Schema({
  objective: { type: Number, default: 0 },
  inTheMoment: { type: Number, default: 0 },
  salesInTheMoment: { type: Number, default: 0 },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
  },
})

const Goals = mongoose.model('Goals', GoalsSchema)

module.exports = Goals
