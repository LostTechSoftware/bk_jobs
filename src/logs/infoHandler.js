const moment = require('moment')
const { v4: uuidv4 } = require('uuid')

const Coralogix = require('./config')

const logger = new Coralogix.CoralogixLogger('INFO')

function infoHandler(info, requestId = uuidv4()) {
  const data = new Coralogix.Log({
    severity: Coralogix.Severity.info,
    className: 'logger',
    methodName: 'data',
    text: `[INFO ${moment().format('MMM Do YY')}] ${info} || Request ID: ${requestId}`,
  })

  logger.addLog(data)

  console.log(`[INFO ${moment().format('MMM Do YY')}] ${info} || Request ID: ${requestId}`)
}

module.exports = infoHandler
