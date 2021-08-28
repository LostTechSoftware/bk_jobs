const axios = require('axios')
const moment = require('moment')
const cron = require('node-cron')
const Axios = require('axios')
const Holidays = require('date-holidays')
const { Notification } = require('../../models/notifications')
const { User } = require('../../models/user')
const { Client } = require('../../models/clients')
const { infoHandler } = require('../../logs')
const logs = require('../../logs')

const hd = new Holidays('BR')

const { BK_AI_URL, BK_AI_AUTHORIZATION } = process.env

async function SendNotification() {
  try {
    infoHandler('Sending notifications to users and clientes')

    let temperature = ''
    const apiKey = '8b194f16a55f5e7fa875c570b8d74fd7'

    const { data } = await Axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=Sao Paulo&appid=${apiKey}&units=metric`
    ).catch((err) => logs.error(err.response.data))

    temperature = parseFloat(data.main.temp) + 7

    const now = moment().format('YYYY-MM-DD')
    const holiday = hd.isHoliday(new Date(`${now} 11:00:00`))

    let texts = () => []

    if (temperature < 15) {
      texts = (food) => [
        { title: 'Que frio né?', body: `Bora pedir aquele ${food || 'pizza'} para dar uma esquentada!` },
        { title: 'Que gelo!', body: 'Nesse frio de arrepiar é melhor pedir algo pra esquentar!' },
      ]
    }

    if (temperature > 30) {
      texts = () => [
        { title: 'Quer se refrescar?', body: 'Veja as bebidas sugeridas para você!' },
        { title: 'Parece que o clima esquentou', body: 'Para driblar esse calor só pedindo uma bebida!' },
      ]
    }

    if (holiday && holiday.length) {
      texts = (food, drink) => [
        { title: `${holiday[0].name}`, body: 'Vamos comemorar esse dia com muita comida! Veja as promoções de hoje' },
        {
          title: 'Quer aproveitar esse feriado? ',
          body: `Peça agora mesmo um(a) ${food || 'pizza'} ou ${drink || 'coca-cola'} para comemorar!`,
        },
        {
          title: 'Vamos aproveitar esse feriado!',
          body: `Peça agora mesmo um(a) ${food || 'pizza'} ou ${drink || 'coca-cola'} de comemoração!`,
        },
      ]
    }

    texts = (food, drink) => [
      { title: 'Com fome?', body: 'Vem dar uma olhada nas promoções de hoje!' },
      {
        title: `Tá afim de um(a) ${food || 'pizza'} ou ${drink || 'coca-cola'}?`,
        body: 'Veja quais produtos estão em promoção hoje!',
      },
    ]

    const users = await User.find()
    const clients = await Client.find()

    const usersToSend = users.length
    const clientsToSend = clients.length

    let countUser = 0
    let countClient = 0

    for (const u of users) {
      logs.info(`Get suggestion on bk_ai for ${u.name}`)
      const {
        data: { food, drink },
      } = await axios.post(`${BK_AI_URL}/get/user`, { UserId: u._id }, { headers: { Authorization: BK_AI_AUTHORIZATION } })

      const index = Math.floor(Math.random() * texts().length)

      const { title, body } = texts(food, drink)[index] || {
        title: 'Com fome?',
        body: 'Vem dar uma olhada nas promoções de hoje!',
      }

      logs.info(`The title and body respectivaly is ${(title, body)}`)

      const notification = await Notification.create({ title, body })

      notification.send = notification.send + 1
      notification.sended = true

      await notification.save()

      if (u.ExponentPushToken) {
        await axios.post(
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
      } else {
        logs.info(`Skiping send notification, user dont has ExponentPushToken`)
      }

      countUser = countUser + 1
      logs.info(`Sended ${countUser}/${usersToSend}`)
    }

    for (const c of clients) {
      const index = Math.floor(Math.random() * texts().length)

      const { title, body } = texts()[index] || {
        title: 'Com fome?',
        body: 'Vem dar uma olhada nas promoções de hoje!',
      }

      logs.info(`The title and body respectivaly is ${(title, body)}`)

      const notification = await Notification.create({ title, body })

      notification.send = notification.send + 1
      notification.sended = true

      await notification.save()

      if (c.ExponentPushToken) {
        await axios.post(
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
      } else {
        logs.info(`Skiping send notification, client dont has ExponentPushToken`)
      }

      countClient = countClient + 1
      logs.info(`Sended ${countClient}/${clientsToSend}`)
    }
  } catch (error) {
    logs.error(error)
  }
}

const initSendNotification = () => {
  cron.schedule('0 19 * * 3,5,0', SendNotification)

  logs.info('SendNotification job initied')
}

module.exports = { initSendNotification }
