const { logger } = require('module-haven-logging')
const HttpError = require('../HttpError');

module.exports = (err, req, res, next) => {
  const code = err instanceof HttpError ? err.code : 500;
  logger.error(err);
  res.status(code).json({ message: `Error ${code}` });
}