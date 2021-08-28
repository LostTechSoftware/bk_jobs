const { initBoletosCreate } = require('./BoletoCreate')
const { initFindOrders } = require('./FindOrders')
const { initInitalizeModeration } = require('./InitializeModeration')
const { initPartnerSales } = require('./PartnerSales')
const { initinitializeScrapping } = require('./InitializeScrapping')
const { initProductCount } = require('./ProductCount')
const { initProductSchedule } = require('./ProductSchedule')
const { initRevenueCity } = require('./RevenueCity')
const { initSendNotification } = require('./SendNotification')
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
  initSendNotification()
  initPartnerSales()
  initinitializeScrapping()
}

module.exports = { initJobs }
