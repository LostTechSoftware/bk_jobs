const moment = require('moment')
const cron = require('node-cron')
const Order = require('../../models/order')
const Restaurant = require('../../models/restaurant')
const { infoHandler } = require('../../logs')
const { SendSlackNotification } = require('../../../../bk_clientes/src/services/Slack')

async function PartnerSales() {
  const restaurants = await Restaurant.find()
  for (const restaurant of restaurants) {
    const ordersInThisWeek = []
    const orders = await Order.find({ restaurant: restaurant._id })
    console.log(restaurant._id)
    for (const order of orders) {
      const thisWeek = moment(order.createdAt).isBetween(moment().subtract(7, 'days'), moment())
      console.log(thisWeek)
      if (thisWeek) {
        ordersInThisWeek.push(order)
      }
    }
    if (ordersInThisWeek.length) {
      console.log('LOOOOOOOOOOOOOOOOOOOOOOP')
      const reducer = (accumulator, currentValue) => accumulator + currentValue
      const totalValue = ordersInThisWeek.map((order) => order.realPrice).reduce(reducer)
      console.log(totalValue)
      if (totalValue < 300) {
        SendSlackNotification(
          `O estabelecimento ${restaurant.name}, da cidade ${restaurant.city} vendeu apenas ${restaurant.sales} nos últimos sete dias`,
          'SendPartnerSales'
        )
      }
    }
  }
}

const initPartnerSales = () => {
  cron.schedule('*/10 * * * * *', PartnerSales)

  infoHandler('PartnerSales job initied')
}

module.exports = { initPartnerSales }
