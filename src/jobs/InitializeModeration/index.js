const cron = require('node-cron')
const { default: axios } = require('axios')
const logs = require('../../logs')

async function initalizeModeration() {
  try {
    await axios
      .post(
        process.env.NODE_ENV === 'production'
          ? `https://bk-moderation.herokuapp.com/`
          : `https://bk-moderation-staging.herokuapp.com/`
      )
      .catch((err) => logs.error(err.response.data))
  } catch (error) {
    logs.error(error)
  }
}

const initInitalizeModeration = () => {
  cron.schedule('0 */4 * * *', initalizeModeration)

  logs.info('initalizeModeration job initied')
}

module.exports = { initInitalizeModeration }
