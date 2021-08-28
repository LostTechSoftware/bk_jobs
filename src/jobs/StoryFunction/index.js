const cron = require('node-cron')
const { infoHandler } = require('../../logs')
const ErrorHandler = require('../../logs/errorHandler')
const { Story } = require('../../models/story')

async function StoryFunction() {
  try {
    const stories = await Story.find()

    const now = new Date()

    const h = now.setHours(now.getHours() - 24)

    const storiesFiltered = stories.filter((s) => {
      return s.createdAt < h
    })

    storiesFiltered.map(async (s) => {
      await Story.findByIdAndDelete(s._id)
    })
  } catch (error) {
    ErrorHandler(error)
  }
}

const initStoryFunction = () => {
  cron.schedule('0 */1 * * *', StoryFunction)

  infoHandler('StoryFunction job initied')
}

module.exports = { initStoryFunction }
