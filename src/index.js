require('dotenv/config')
const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const http = require('http')
const rateLimit = require('express-rate-limit')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const helmet = require('helmet')
const requestIp = require('request-ip')

const app = express()
const infoHandler = require('./logs/infoHandler')

app.use(cors())
app.use(cookieParser())
app.use(bodyparser.json())
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
)

const server = http.Server(app)

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 500,
  keyGenerator: (req) => {
    return req.ip
  },
  handler: (_, res) => {
    res.status(429).send('Limit of requests is hit-in')
  },
})

app.use(rateLimiter)
app.use((req, res, next) => {
  res.set('X-Powered-By', 'PHP/7.1.7')
  next()
})
app.use(helmet())

Sentry.init({
  dsn: process.env.SENTRY_URL,
  environment: process.env.PROD === true ? 'PRODUCTION' : 'STAGING',
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({
      app,
    }),
  ],
  tracesSampleRate: 1.0,
})

app.use((req, res, next) => {
  req.sentry = Sentry

  return next()
})

app.use(Sentry.Handlers.requestHandler())

app.use(Sentry.Handlers.errorHandler())

app.use(Sentry.Handlers.tracingHandler())

app.use(requestIp.mw())

require('./jobs')
require('./logs/init')(app)
require('./logs/initResponse')(app)
require('./routes')(app)

infoHandler(`Running in port ${process.env.PORT || 3001}`)

server.listen(process.env.PORT || 3001)
