const { logger } = require('module-haven-logging')

module.exports = (req, res, next) => {
  res.once('finish', function() {
    logger.info(`${req.originalUrl} ${this.statusCode}`, {
      path: req.route.path,
      params: req.params,
      statusCode: this.statusCode,
     })
  })
  next();
}