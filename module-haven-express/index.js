const app = require('./src/app');
const server = require('./src/server');
const HttpError = require('./src/HttpError');
const middleware = require('./src/middleware');

module.exports = {
  app,
  server,
  HttpError,
  middleware,
}