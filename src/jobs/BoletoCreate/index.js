const cron = require('node-cron')
const sgMail = require('@sendgrid/mail')
const moment = require('moment')
const { Restaurant } = require('../../models/restaurant')
const { createdPaymentEmail } = require('../../templates')
const generateNewPayment = require('../../services/Finance/generateNewPayment')
const { PaymentFlows } = require('../../models/paymentFlow')
const logs = require('../../logs')

async function BoletosCreate() {
  try {
    const restaurants = await Restaurant.find()
    const now = new Date()
    restaurants.map(async (r) => {
      const restaurant = await Restaurant.findById(r._id).select(
        '+CpfCnpj value ordersMonthCount couponValue street Number complement city postalCode uf receipt nextPayment name customer'
      )
      if (restaurant.nextPayment <= now) {
        if (restaurant.value > 2) {
          const reducer = (accumulator, currentValue) => accumulator + currentValue

          const paymentFlow = await PaymentFlows.findOne({ restaurant: r._id, referenceMonth: moment().month() })

          if (!paymentFlow) return

          const otherRatesSome =
            paymentFlow && paymentFlow.otherRates.length && paymentFlow.otherRates.map((info) => info.rateValue).reduce(reducer)

          const value = paymentFlow.feeFoodZilla - paymentFlow.couponsSales + paymentFlow.boosterInvestiments + otherRatesSome

          const boleto = await generateNewPayment(r._id, value)

          const date = new Date()

          restaurant.nextPayment = date.setHours(date.getHours() + 30 * 24)

          await restaurant.save()

          if (boleto) {
            sgMail.setApiKey(process.env.SENDGRID_KEY)
            const msg = {
              to: restaurant.email,
              from: process.env.EMAIL,
              subject: 'FoodZilla',
              text: 'FoodZilla',
              html: createdPaymentEmail({ now, boleto }),
            }
            sgMail.send(msg)
          }
        }
      }
    })
  } catch (error) {
    logs.error(error)
  }
}

const initBoletosCreate = () => {
  cron.schedule('* * * * *', BoletosCreate)

  logs.info('BoletosCreate job initied')
}

module.exports = { initBoletosCreate }
