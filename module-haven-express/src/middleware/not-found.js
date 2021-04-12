const HttpError = require('../HttpError');

module.exports = (req, res, next) => {
  next(new HttpError({ code: 404 }));
};