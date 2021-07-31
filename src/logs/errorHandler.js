const moment = require('moment')
const Sentry = require('@sentry/node')
const { v4: uuidv4 } = require('uuid')

const Coralogix = require('./config')

const logger = new Coralogix.CoralogixLogger('ERROR')

function ErrorHandler(error, requestId = uuidv4()) {
  const data = new Coralogix.Log({
    severity: Coralogix.Severity.info,
    className: 'logger',
    methodName: 'data',
    text: `[ERROR ${moment().format('MMM Do YY')}] ${error} || Request ID: ${requestId}`,
  })

  logger.addLog(data)

  console.log(`[ERROR ${moment().format('MMM Do YY')}] ${error} || Request ID: ${requestId}`)

  Sentry.captureException(error)
}

module.exports = ErrorHandler
