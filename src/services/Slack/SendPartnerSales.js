const axios = require('axios')
const logs = require('../../logs')

const SendPartnerSales = async (message) => {
  try {
    await axios.post(process.env.SLACK_PARTNER_SALES, {
      text: message,
    })

    logs.info('Message have sendend to slack')
  } catch (error) {
    logs.error(error)
  }
}

module.exports = SendPartnerSales
