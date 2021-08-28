const cron = require('node-cron')
const axios = require('axios')
const faker = require('faker')
const bcrypt = require('bcryptjs')
const { generate } = require('gerador-validador-cpf')
const logs = require('../../logs')
const {
  User: { UserProduction, User },
  Access: { AccessProduction, Access },
  City: { CityProduction, City },
  Client: { ClientProduction, Client },
  Coupon: { CouponProduction, Coupon },
  CouponChange: { CouponChangeProduction, CouponChange },
  Categories: { CategoriesProduction, Categories },
  Employeer: { EmployeerProduction, Employeer },
  Franchisees: { FranchiseesProduction, Franchisees },
  Goal: { GoalsProduction, Goals },
  Menu: { MenuProduction, Menu },
  Message: { MessagesProduction, Messages },
  Notification: { NotificationProduction, Notification },
  Order: { OrderProduction, Order },
  PaymentFlow: { PaymentFlowsProduction, PaymentFlows },
  Payment: { PaymentsProduction, Payments },
  Product: { ProductProduction, Product },
  Promotion: { PromotionsProduction, Promotions },
  Restaurant: { RestaurantProduction, Restaurant },
  Row: { RowProduction, Row },
  Story: { StoryProduction, Story },
  RowsAdditional: { RowAdditionalProduction, RowAdditional },
} = require('../../models')

const { NODE_ENV } = process.env

async function generateCustomer(restaurantInfo) {
  const { name, cpfCnpj, email } = restaurantInfo

  const { data } = await axios
    .post(
      `${process.env.ASAAS_URL}/customers`,
      {
        name,
        cpfCnpj,
        email,
      },
      {
        headers: {
          access_token: process.env.ASAAS,
        },
      }
    )
    .catch((err) => logs.error(err.response.data))

  return data
}

async function resetBank() {
  try {
    if (NODE_ENV !== 'staging') return logs.info('Enviroment isn`t staging, aborting function')

    logs.info('Deleting all bank in staging')

    await User.deleteMany()
    await Access.deleteMany()
    await City.deleteMany()
    await Client.deleteMany()
    await Coupon.deleteMany()
    await CouponChange.deleteMany()
    await Employeer.deleteMany()
    await Franchisees.deleteMany()
    await Goals.deleteMany()
    await Menu.deleteMany()
    await Messages.deleteMany()
    await Notification.deleteMany()
    await Order.deleteMany()
    await PaymentFlows.deleteMany()
    await Payments.deleteMany()
    await Product.deleteMany()
    await Promotions.deleteMany()
    await Restaurant.deleteMany()
    await Row.deleteMany()
    await Story.deleteMany()
    await RowAdditional.deleteMany()
    await Categories.deleteMany()

    logs.info('Get production bank info')

    const user = await UserProduction.find()
    const access = await AccessProduction.find()
    const city = await CityProduction.find()
    const client = await ClientProduction.find()
    const coupon = await CouponProduction.find()
    const couponchange = await CouponChangeProduction.find()
    const employeer = await EmployeerProduction.find()
    const franchisees = await FranchiseesProduction.find()
    const goal = await GoalsProduction.find()
    const menu = await MenuProduction.find()
    const message = await MessagesProduction.find()
    const notification = await NotificationProduction.find()
    const order = await OrderProduction.find()
    const paymentflow = await PaymentFlowsProduction.find()
    const payment = await PaymentsProduction.find()
    const product = await ProductProduction.find()
    const promotion = await PromotionsProduction.find()
    const restaurant = await RestaurantProduction.find()
    const row = await RowProduction.find()
    const story = await StoryProduction.find()
    const rowadditional = await RowAdditionalProduction.find()
    const categories = await CategoriesProduction.find()

    logs.info('Change users sensitive infos')

    for (const userInfo of user) {
      userInfo.password = await bcrypt.hash('wdjj3010', 8)
      userInfo.address = []
      userInfo.cards = []
      userInfo.DevicePushToken = ''
      userInfo.ExponentPushToken = ''
      userInfo.email = faker.internet.email().toLocaleLowerCase().trim()
      userInfo.telephone = faker.phone.phoneNumber()
      userInfo.name = faker.name.findName()
      userInfo.googleId = ''
      userInfo.appleId = ''
      userInfo.customer = ''
    }

    for (const restaurantInfo of restaurant) {
      restaurantInfo.email = faker.internet.email().toLocaleLowerCase().trim()
      restaurantInfo.CpfCnpj = generate()

      const customer = await generateCustomer(restaurantInfo)

      restaurantInfo.customer = customer.id
      restaurantInfo.password = await bcrypt.hash('wdjj3010', 8)
      restaurantInfo.ExponentPushToken = []
      restaurantInfo.telephone = faker.phone.phoneNumber()
      restaurantInfo.street = faker.address.streetAddress()
      restaurantInfo.postalCode = faker.address.zipCode()
    }

    for (const accessInfo of access) {
      accessInfo.email = faker.internet.email().toLocaleLowerCase().trim()
      accessInfo.password = await bcrypt.hash('wdjj3010', 8)
    }

    logs.info('Creating datas in staging')

    await User.insertMany(user)
    await Access.insertMany(access)
    await City.insertMany(city)
    await Client.insertMany(client)
    await Coupon.insertMany(coupon)
    await CouponChange.insertMany(couponchange)
    await Employeer.insertMany(employeer)
    await Franchisees.insertMany(franchisees)
    await Goals.insertMany(goal)
    await Menu.insertMany(menu)
    await Messages.insertMany(message)
    await Notification.insertMany(notification)
    await Order.insertMany(order)
    await PaymentFlows.insertMany(paymentflow)
    await Payments.insertMany(payment)
    await Product.insertMany(product)
    await Promotions.insertMany(promotion)
    await Restaurant.insertMany(restaurant)
    await Row.insertMany(row)
    await Story.insertMany(story)
    await RowAdditional.insertMany(rowadditional)
    await Categories.insertMany(categories)

    logs.info('Database reinitied successfully')
  } catch (error) {
    logs.error('error')
  }
}

const initResetBank = () => {
  cron.schedule('0 1 * * 0', resetBank)

  logs.info('resetBank job initied')
}

module.exports = { initResetBank }
