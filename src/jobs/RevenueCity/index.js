const cron = require('node-cron')
const sgMail = require('@sendgrid/mail')
const Franchisees = require('../../models/franchisees')
const City = require('../../models/citys')
const { revenueCityFoodZillaEmail, revenueCityFranchiseeEmail } = require('../../templates')
const { infoHandler, errorHandler } = require('../../logs')

async function RevenueCity() {
  try {
    const cities = await City.find()
    const now = new Date()

    cities.map(async (c) => {
      if (c.CreatedAt.setHours(c.CreatedAt.getHours() + 30 * 24) >= now) {
        if (!c.revenues) return
        sgMail.setApiKey(process.env.SENDGRID_KEY)
        const msg = {
          to: process.env.EMAIL,
          from: process.env.EMAIL,
          subject: 'Revenue Liberado',
          text: `Cidade: ${c.city_Name} `,
          html: revenueCityFoodZillaEmail({ now, c }),
        }
        sgMail.send(msg)

        const franchisee = await Franchisees.findById(c.franchisee)

        sgMail.setApiKey(process.env.SENDGRID_KEY)
        const message = {
          to: franchisee.Franchisees_email,
          from: process.env.EMAIL,
          subject: 'Lucro do Mês',
          text: `Cidade: ${c.city_Name} `,
          html: revenueCityFranchiseeEmail({ now, c, franchisee }),
        }
        sgMail.send(message)
      }
    })
  } catch (error) {
    errorHandler(error)
  }
}

const initRevenueCity = () => {
  cron.schedule('* * * * *', RevenueCity)

  infoHandler('RevenueCity job initied')
}

module.exports = { initRevenueCity }
