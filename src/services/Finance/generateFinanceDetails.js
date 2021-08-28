const moment = require('moment')
const logs = require('../../logs')
const { Goals } = require('../../models/goals')
const { PaymentFlows } = require('../../models/paymentFlow')
const { Restaurant } = require('../../models/restaurant')

async function generateFinanceDetails(RestaurantId, order) {
  const restaurant = await Restaurant.findById(RestaurantId).select(
    '+saleDay name feeFoodZilla couponValue value saleOnline ordersMonthCount'
  )
  try {
    restaurant.saleDay = restaurant.saleDay + order.realPrice

    let paymentFlow = await PaymentFlows.findOne({ restaurant: restaurant._id, referenceMonth: moment().month() })

    if (!paymentFlow) paymentFlow = await PaymentFlows.create({ restaurant: restaurant._id, referenceMonth: moment().month() })

    const referenceMonth = moment(paymentFlow.referenceMonth)

    if (!referenceMonth.month() === moment().month()) {
      paymentFlow = await PaymentFlows.create({ restaurant: restaurant._id, referenceMonth: moment().month() })
    }

    const feeValue = (order.realPrice / 100) * restaurant.feeFoodZilla

    paymentFlow.feeFoodZilla = paymentFlow.feeFoodZilla + feeValue
    paymentFlow.sales = paymentFlow.sales + order.realPrice

    if (order.coupon) {
      paymentFlow.couponsSales = paymentFlow.couponsSales + order.couponUsed
    }

    await paymentFlow.save()
  } catch (error) {
    logs.error(error)
  }

  try {
    const goals = await Goals.findOne({ restaurant: restaurant._id })

    goals.inTheMoment = goals.inTheMoment + order.realPrice
    goals.salesInTheMoment = goals.salesInTheMoment + 1

    await goals.save()
  } catch (error) {
    logs.error(error)
  }
}

module.exports = generateFinanceDetails
