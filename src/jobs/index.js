const { initBoletosCreate } = require('./BoletoCreate')
const { initFindOrders } = require('./FindOrders')
const { initInitalizeModeration } = require('./InitializeModeration')
const { initinitializeScrapping } = require('./InitializeScrapping')
const { initPartnerSales } = require('./PartnerSales')
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
  initinitializeScrapping()
  initPartnerSales()
}

module.exports = { initJobs }
