const { infoHandler } = require('..')
const { v4: uuidv4 } = require('uuid')

module.exports = (app) => {
  app.all('*', (req, res, next) => {
    const id = uuidv4()

    infoHandler(`[${req.protocol} ${req.method}] ${req.originalUrl}:`, id)
    infoHandler(JSON.stringify(req.params), id)
    infoHandler(JSON.stringify(req.body), id)

    return next()
  })
}
