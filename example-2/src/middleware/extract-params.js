const { HttpError } = require('module-haven-express');

module.exports = async function extractParams(schema, req) {
  try {
    const { body, query, params } = req;
    await schema.validate({ body, query, params });
    return schema.cast(req);
  } catch (error) {
    throw new HttpError({ code: 400, error });
  }
}