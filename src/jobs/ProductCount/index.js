const cron = require('node-cron')
const logs = require('../../logs')
const { Product } = require('../../models/product')

async function ProductCount() {
  try {
    const products = await Product.find()

    products.map(async (p) => {
      p.ordersCount = 0

      await p.save()
    })
  } catch (error) {
    logs.error(error)
  }
}

const initProductCount = () => {
  cron.schedule('0 */1 1 * *', ProductCount)

  logs.info('ProductCount job initied')
}

module.exports = { initProductCount }
