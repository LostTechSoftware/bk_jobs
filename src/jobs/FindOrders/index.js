const cron = require('node-cron')
const Axios = require('axios')
const { Order } = require('../../models/order')
const logs = require('../../logs')
const getRequestId = require('../../getRequestId')

async function FindOrders() {
  try {
    const now = new Date()
    const orders = await Order.find()

    orders.map(async (order) => {
      if (order.expiresIn < now) {
        if (order.approved === 'Aguardando aprovação') {
          if (order.completed) return

          await Axios.post(
            process.env.NODE_ENV === 'production'
              ? `https://bk.foodzilla.com.br/reject/order/${order._id}`
              : `https://staging-bk.foodzilla.com.br/reject/order/${order._id}`,
            {
              reason: 'Restaurante demorou a aceitar o pedido',
            },
            { headers: { request_id: getRequestId() } }
          ).catch((err) => logs.error(err.response.data))
        }
      }

      const createdAt = order.createdAt.setHours(order.createdAt.getHours() + 5)

      if (createdAt < now) {
        if (!order.completed) {
          if (!order.canceled) {
            const ordersFunc = await Order.findById(order._id)

            ordersFunc.completed = true
            ordersFunc.status = 'Completo'
            await ordersFunc.save()
          }
        }
      }
    })
  } catch (error) {
    logs.error(error)
  }
}

const initFindOrders = () => {
  cron.schedule('* * * * *', FindOrders)

  logs.info('FindOrders job initied')
}

module.exports = { initFindOrders }
