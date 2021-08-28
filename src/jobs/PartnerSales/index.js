const moment = require('moment')
const cron = require('node-cron')
const Order = require('../../models/order')
const Restaurant = require('../../models/restaurant')
const { infoHandler } = require('../../logs')
const { SendSlackNotification } = require('../../services/Slack')

async function PartnerSales() {
  const restaurants = await Restaurant.find()

  for (const restaurant of restaurants) {
    const ordersInThisWeek = []
    const orders = await Order.find({ restaurant: restaurant._id })

    for (const order of orders) {
      const thisWeek = moment(order.createdAt).isBetween(moment().subtract(7, 'days'), moment())

      if (thisWeek) {
        ordersInThisWeek.push(order)
      }
    }
    if (ordersInThisWeek.length) {
      const reducer = (accumulator, currentValue) => accumulator + currentValue
      const totalValue = ordersInThisWeek.map((order) => order.realPrice).reduce(reducer)

      if (totalValue < 300) {
        SendSlackNotification(
          `O estabelecimento ${restaurant.name}, da cidade ${restaurant.city} vendeu apenas ${totalValue.toLocaleString(
            'pt-br',
            { currency: 'BRL', style: 'currency' }
          )} nos últimos sete dias`,
          'SendPartnerSales'
        )
      }
    } else {
      SendSlackNotification(
        `O estabelecimento ${restaurant.name}, da cidade ${restaurant.city} não realizou vendas nos últimos sete dias`,
        'SendPartnerSales'
      )
    }
  }
}

const initPartnerSales = () => {
  cron.schedule('0 9 * * 1', PartnerSales)

  infoHandler('PartnerSales job initied')
}

module.exports = { initPartnerSales }
