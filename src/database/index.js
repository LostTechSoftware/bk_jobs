const mongoose = require('mongoose')
const { infoHandler } = require('../logs')

const stagingConnection = mongoose.createConnection(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

infoHandler(`Banco de dados conectado: ${process.env.NODE_ENV === true ? 'Produção' : 'Staging'}`)

const productionConnection = mongoose.createConnection(process.env.MONGO_URL_PROD, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

infoHandler(`Banco de dados conectado: Produção`)

module.exports = { stagingConnection, productionConnection }
