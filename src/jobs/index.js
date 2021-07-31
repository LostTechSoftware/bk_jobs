const { initBoletosCreate } = require('./BoletoCreate')
const { initFindOrders } = require('./FindOrders')
const { initInitalizeModeration } = require('./InitializeModeration')
const { initProductCount } = require('./ProductCount')
const { initProductSchedule } = require('./ProductSchedule')
const { initRevenueCity } = require('./RevenueCity')
const { initSendNotificationScheduled } = require('./SendNotificationScheduled')
const { initStoryFunction } = require('./StoryFunction')

function initJobs() {
  initBoletosCreate()
  initFindOrders()
  initProductCount()
  initProductSchedule()
  initRevenueCity()
  initSendNotificationScheduled()
  initStoryFunction()
  initInitalizeModeration()
}

module.exports = { initJobs }
