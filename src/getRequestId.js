const httpContext = require('express-http-context')
const { v4: uuidv4 } = require('uuid')

const getRequestId = () => {
  const requestId = httpContext.get('requestId') || uuidv4()

  if (!httpContext.get('requestId')) {
    httpContext.set('requestId', requestId)
  }

  return requestId
}

module.exports = getRequestId
