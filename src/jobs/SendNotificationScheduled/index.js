const cron = require('node-cron')
const Axios = require('axios')
const Notification = require('../../models/notifications')
const User = require('../../models/user')
const Client = require('../../models/clients')
const logs = require('../../logs')

async function SendNotificationScheduled() {
  try {
    const notifications = await Notification.find()
    const user = await User.find()
    const client = Client.find()

    notifications.map(async (n) => {
      const notification = await Notification.findById(n)

      if (notification.schedule) {
        if (notification.schedule < new Date()) {
          if (notification.sended) return
          if (notification.tokens.length) {
            notification.send = notification.tokens.length

            await notification.save()
            notification.tokens.map(async (t) => {
              return Axios.post(
                'https://exp.host/--/api/v2/push/send',
                {
                  to: t,
                  sound: 'default',
                  title: notification.title,
                  body: notification.body,
                },
                {
                  headers: {
                    Accept: 'application/json',
                    'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                  },
                }
              )
            })
          } else {
            user.map(async (u) => {
              notification.send = notification.send + 1

              await notification.save()

              return Axios.post(
                'https://exp.host/--/api/v2/push/send',
                {
                  to: u.ExponentPushToken,
                  sound: 'default',
                  title: notification.title,
                  body: notification.body,
                },
                {
                  headers: {
                    Accept: 'application/json',
                    'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                  },
                }
              )
            })

            client.map(async (c) => {
              notification.send = notification.send + 1
              await Axios.post(
                'https://exp.host/--/api/v2/push/send',
                {
                  to: c.ExponentPushToken,
                  sound: 'default',
                  title: notification.title,
                  body: notification.body,
                },
                {
                  headers: {
                    Accept: 'application/json',
                    'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                  },
                }
              )
            })
          }
          notification.sended = true
          await notification.save()
        }
      }
    })
  } catch (error) {
    logs.error(error)
  }
}

const initSendNotificationScheduled = () => {
  cron.schedule('* * * * *', SendNotificationScheduled)

  logs.info('SendNotificationScheduled job initied')
}

module.exports = { initSendNotificationScheduled }
