const cron = require('node-cron')
const { default: axios } = require('axios')
const ErrorHandler = require('../../logs/errorHandler')
const infoHandler = require('../../logs/infoHandler')

async function initalizeModeration() {
  try {
    await axios
      .post(
        process.env.NODE_ENV === 'production'
          ? `https://bk-moderation.herokuapp.com/`
          : `https://bk-moderation-staging.herokuapp.com/`
      )
      .catch((err) => ErrorHandler(err.response.data))
  } catch (error) {
    ErrorHandler(error)
  }
}

const initInitalizeModeration = () => {
  cron.schedule('0 */4 * * *', initalizeModeration)

  infoHandler('initalizeModeration job initied')
}

module.exports = { initInitalizeModeration }
