const axios = require('axios')
const { errorHandler, infoHandler } = require('../../logs')

const SendPartnerSales = async (message) => {
  try {
    await axios.post('https://hooks.slack.com/services/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', {
      text: message,
    })

    infoHandler('Message have sendend to slack')
  } catch (error) {
    errorHandler(error)
  }
}

module.exports = SendPartnerSales
