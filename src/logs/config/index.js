const Coralogix = require('coralogix-logger')

const config = new Coralogix.LoggerConfig({
  applicationName: 'application_name',
  privateKey: 'private_key',
  subsystemName: process.env.PROD == true ? 'production' : 'staging',
})

Coralogix.CoralogixLogger.configure(config)

module.exports = Coralogix
