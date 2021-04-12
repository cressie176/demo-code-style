const { object, number } = require('yup');
const extractParams = require('./extract-params');

const schema = object().shape({
  query: object().shape({
    offset: number().positive().integer(),
    limit: number().positive().integer().min(10).max(100),
  })
})

module.exports = function init({ sequelize, userService }) {

  async function listUsers(req, res, next) {
    try {
      const { query: { offset, limit } } = await extractParams(schema, req);
      const users = await sequelize.transaction(() => {
        return userService.list({ offset, limit })
      });
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  return listUsers;
}