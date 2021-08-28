const axios = require('axios')
const logs = require('../../logs')

const SendPartnerSales = async (message) => {
  try {
    await axios.post('https://hooks.slack.com/services/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', {
      text: message,
    })

    logs.info('Message have sendend to slack')
  } catch (error) {
    logs.error(error)
  }
}

module.exports = SendPartnerSales
