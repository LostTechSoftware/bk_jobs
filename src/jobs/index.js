const { initBoletosCreate } = require('./BoletoCreate')
const { initFindOrders } = require('./FindOrders')
const { initInitalizeModeration } = require('./InitializeModeration')
const { initProductCount } = require('./ProductCount')
const { initProductSchedule } = require('./ProductSchedule')
const { initResetBank } = require('./resetBank')
const { initRevenueCity } = require('./RevenueCity')
const { initSendNotificationScheduled } = require('./SendNotificationScheduled')
const { initStoryFunction } = require('./StoryFunction')

const { NODE_ENV } = process.env

function initJobs() {
  initBoletosCreate()
  initFindOrders()
  initProductCount()
  initProductSchedule()
  initRevenueCity()
  initSendNotificationScheduled()
  initStoryFunction()
  initInitalizeModeration()
  // initSendNotification()
  // initinitializeScrapping()

  if (NODE_ENV === 'staging') {
    initResetBank()
  }
}

module.exports = { initJobs }
