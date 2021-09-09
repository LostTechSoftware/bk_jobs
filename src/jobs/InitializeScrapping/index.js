const cron = require('node-cron')
const { default: axios } = require('axios')
const logs = require('../../logs')

async function initializeScrapping() {
  try {
    const { BACKEND_AUTHORIZATION } = process.env
    await axios
      .get(
        process.env.NODE_ENV === 'production'
          ? `https://bk-scrapping.herokuapp.com/init`
          : `https://bk-scrapping-staging.herokuapp.com/init`,
        { headers: { Authorization: BACKEND_AUTHORIZATION } }
      )
      .catch((err) => logs.error(err.response.data))
  } catch (error) {
    logs.error(error)
  }
}

const initinitializeScrapping = () => {
  cron.schedule('0 3 * * *', initializeScrapping)

  logs.info('initializeScrapping job initied')
}

module.exports = { initinitializeScrapping }
