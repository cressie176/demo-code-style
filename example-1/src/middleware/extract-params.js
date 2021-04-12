const HttpError = require('../HttpError');

module.exports = async function extractParams(schema, req) {
  try {
    const { body, query, params } = req;
    await schema.validate({ body, query, params });
    return schema.cast({ body, query, params });
  } catch (error) {
    throw new HttpError({ code: 400, error });
  }
}