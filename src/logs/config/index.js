/* eslint eqeqeq: "off" */
const Coralogix = require('coralogix-logger')

const config = new Coralogix.LoggerConfig({
  applicationName: 'bk_jobs',
  privateKey: '8a3ffaea-a3d4-c5b0-3a11-ab8b2ba8ceef',
  subsystemName: process.env.NODE_ENV,
})

Coralogix.CoralogixLogger.configure(config)

module.exports = Coralogix
