const cron = require('node-cron')
const Axios = require('axios')
const Notification = require('../../models/notifications')
const User = require('../../models/user')
const Client = require('../../models/clients')
const { infoHandler } = require('../../logs')
const ErrorHandler = require('../../logs/errorHandler')

async function SendNotification() {
  try {
    let temperature = ''
    let apiKey = '8b194f16a55f5e7fa875c570b8d74fd7'

    const { data } = await Axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=Sao Paulo&appid=${apiKey}&units=metric`
    ).catch((err) => ErrorHandler(err.response.data))

    temperature = data.main.temp
    const month = moment(scope.date)
    d.month()

    const holiday = holidayApi.holidays({
      country: 'BR',
      year: 2019,
      month: 7,
      day: 4,
    })

    let texts = () => []

    if (temperature < 15) {
      texts = (food) => [
        { title: 'Que frio né?', body: `Bora pedir aquele ${food} para dar uma esquentada!` },
        { title: 'Que gelo!', body: 'Nesse frio de arrepiar é melhor pedir algo pra esquentar!' },
      ]
    }

    if (temperature > 30) {
      texts = () => [
        { title: 'Quer se refrescar?', body: 'Veja as bebidas sugeridas para você!' },
        { title: 'Parece que o clima esquentou', body: 'Para driblar esse calor só pedindo uma bebida!' },
      ]
    }

    if (holiday) {
      texts = (food, drink) => [
        { title: '{Feriado}', body: 'Vamos comemorar esse dia com muita comida! Veja as promoções de hoje' },
        { title: 'Quer aproveitar esse feriado? ', body: `Peça agora mesmo um(a) ${food} ou ${drink} para comemorar!` },
        { title: 'Vamos aproveitar esse feriado!', body: `Peça agora mesmo um(a) ${food} ou ${drink} de comemoração!` },
      ]
    }

    texts = (food) => [
      { title: 'Com fome?', body: 'Vem dar uma olhada nas promoções de hoje!' },
      { title: `Tá afim de um(a) ${food} ou ${drink}?`, body: 'Veja quais produtos estão em promoção hoje!' },
    ]

    const index = Math.floor(Math.random() * texts.length)

    const users = await User.find()
    const clients = Client.find()

    const notification = await Notification.findById(n)

    if (notification.sended) return

    users.map(async (u) => {
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

    clients.map(async (c) => {
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

    notification.sended = true
    await notification.save()
  } catch (error) {
    ErrorHandler(error)
  }
}

const initSendNotification = () => {
  // cron.schedule('0 19 * * 3,5,0', SendNotification)
  cron.schedule('*/10 * * * * *', SendNotification)

  infoHandler('SendNotification job initied')
}

module.exports = { initSendNotification }
