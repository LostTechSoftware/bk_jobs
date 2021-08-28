const cron = require('node-cron')
const { default: axios } = require('axios')
const ErrorHandler = require('../../logs/errorHandler')
const infoHandler = require('../../logs/infoHandler')

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
      .catch((err) => ErrorHandler(err.response.data))
  } catch (error) {
    ErrorHandler(error)
  }
}

const initinitializeScrapping = () => {
  cron.schedule('0 3 * * *', initializeScrapping)

  infoHandler('initializeScrapping job initied')
}

module.exports = { initinitializeScrapping }
