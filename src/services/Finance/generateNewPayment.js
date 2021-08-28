const moment = require('moment')
const { default: axios } = require('axios')
const sgMail = require('@sendgrid/mail')
const { Restaurant } = require('../../models/restaurant')
const { PaymentFlows } = require('../../models/paymentFlow')
const logs = require('../../logs')
const couponMorePaymentEmail = require('../../templates/couponMorePaymentEmail')

async function generateNewPayment(PartnerId, valueBody) {
  const paymentFlows = await PaymentFlows.findOne({ restaurant: PartnerId, referenceMonth: moment().month() })
  const restaurant = await Restaurant.findById(PartnerId).select(
    '+CpfCnpj value ordersMonthCount couponValue street Number complement city postalCode uf receipt nextPayment name customer email'
  )

  if (valueBody < 2) {
    sgMail.setApiKey(process.env.SENDGRID_KEY)
    const msg = {
      to: restaurant.email,
      from: process.env.EMAIL,
      subject: 'FoodZilla',
      text: 'FoodZilla',
      html: couponMorePaymentEmail(),
    }
    sgMail.send(msg)

    const reducer = (accumulator, currentValue) => accumulator + currentValue

    const otherRatesSome =
      paymentFlows && paymentFlows.otherRates.length && paymentFlows.otherRates.map((info) => info.rateValue).reduce(reducer)

    const valueSome = paymentFlows.feeFoodZilla + paymentFlows.boosterInvestiments + otherRatesSome

    paymentFlows.feeFoodZilla = paymentFlows.feeFoodZilla - valueBody
    paymentFlows.couponsSales = paymentFlows.couponsSales - valueSome

    return
  }

  const now = new Date()

  now.setHours(now.getHours() + 10 * 24)

  const dia = now.getDate().toString()
  const diaF = now.length === 1 ? `0${dia}` : dia
  const mes = (now.getMonth() + 1).toString()
  const mesF = now.length === 1 ? `0${mes}` : mes
  const anoF = now.getFullYear()

  const value = Math.round((valueBody + 1) * 1) / 1

  const boletos = await axios
    .post(
      `${process.env.ASAAS_URL}/payments`,
      {
        customer: restaurant.customer,
        billingType: 'UNDEFINED',
        dueDate: `${anoF}-${mesF}-${diaF}`,
        value,
        externalReference: paymentFlows._id,
      },
      {
        headers: {
          access_token: process.env.ASAAS,
        },
      }
    )
    .catch((err) => {
      logs.error(err.response.data)
    })

  const boleto = boletos.data

  const receipt = {
    value: boleto.value,
    receiptId: boleto.id,
    date: boleto.dueDate,
    url: boleto.bankSlipUrl,
  }

  restaurant.receipt.push(receipt)

  await restaurant.save()

  paymentFlows.feeFoodZilla = paymentFlows.feeFoodZilla - valueBody
  paymentFlows.parcialPayed = paymentFlows.parcialPayed + valueBody

  await paymentFlows.save()

  return boleto
}

module.exports = generateNewPayment
