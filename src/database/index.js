const mongoose = require('mongoose')
const { infoHandler } = require('../logs')

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
mongoose.Promise = global.Promise

infoHandler(`Banco de dados conectado: ${process.env.NODE_ENV === true ? 'Produção' : 'Staging'}`)

module.exports = mongoose
