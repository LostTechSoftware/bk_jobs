const cron = require('node-cron')
const logs = require('../../logs')
const { Product } = require('../../models/product')

async function ProductSchedule() {
  try {
    const products = await Product.find({
      schedule: true,
    })

    if (products.length > 0) {
      products
        .filter((p) => {
          return p.paused === false
        })
        .map(async (p) => {
          const product = await Product.findById(p._id)

          product.paused = true

          await product.save()
        })
    }

    const d = new Date()
    const n = d.getDay()

    if (n === 0) {
      const productsofDay = await Product.find({
        domingo: true,
      })

      if (productsofDay.length === 0) return

      productsofDay.map(async (p) => {
        const product = await Product.findById(p._id)

        product.paused = false

        await product.save()
      })

      return
    }

    if (n === 1) {
      const productsofDay = await Product.find({
        segunda: true,
      })

      if (productsofDay.length === 0) return

      productsofDay.map(async (p) => {
        const product = await Product.findById(p._id)

        product.paused = false

        await product.save()
      })

      return
    }
    if (n === 2) {
      const productsofDay = await Product.find({
        terca: true,
      })

      if (productsofDay.length === 0) return

      productsofDay.map(async (p) => {
        const product = await Product.findById(p._id)

        product.paused = false

        await product.save()
      })

      return
    }
    if (n === 3) {
      const productsofDay = await Product.find({
        quarta: true,
      })

      if (productsofDay.length === 0) return

      productsofDay.map(async (p) => {
        const product = await Product.findById(p._id)

        product.paused = false

        await product.save()
      })

      return
    }
    if (n === 4) {
      const productsofDay = await Product.find({
        quinta: true,
      })

      if (productsofDay.length === 0) return

      productsofDay.map(async (p) => {
        const product = await Product.findById(p._id)

        product.paused = false

        await product.save()
      })

      return
    }
    if (n === 5) {
      const productsofDay = await Product.find({
        sexta: true,
      })

      if (productsofDay.length === 0) return

      productsofDay.map(async (p) => {
        const product = await Product.findById(p._id)

        product.paused = false

        await product.save()
      })

      return
    }

    if (n === 6) {
      const productsofDay = await Product.find({
        sabado: true,
      })

      if (productsofDay.length === 0) return

      productsofDay.map(async (p) => {
        const product = await Product.findById(p._id)

        product.paused = false

        await product.save()
      })
    }
  } catch (error) {
    logs.error(error)
  }
}

const initProductSchedule = () => {
  cron.schedule('0 */1 * * *', ProductSchedule)

  logs.info('ProductSchedule job initied')
}

module.exports = { initProductSchedule }
