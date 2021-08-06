/* eslint prefer-rest-params: "off" */
const { infoHandler } = require('..')

module.exports = (app) => {
  function modifyResponseBody(req, res, next) {
    const oldSend = res.send

    res.send = function (data) {
      infoHandler(data)

      oldSend.apply(res, arguments)
    }

    next()
  }

  app.use(modifyResponseBody)
}
