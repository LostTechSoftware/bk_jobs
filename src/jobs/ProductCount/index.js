const cron = require('node-cron')
const { infoHandler, errorHandler } = require('../../logs')
const Product = require('../../models/product')

async function ProductCount() {
  try {
    const products = await Product.find()

    products.map(async (p) => {
      p.ordersCount = 0

      await p.save()
    })
  } catch (error) {
    errorHandler(error)
  }
}

const initProductCount = () => {
  cron.schedule('0 */1 1 * *', ProductCount)

  infoHandler('ProductCount job initied')
}

module.exports = { initProductCount }
