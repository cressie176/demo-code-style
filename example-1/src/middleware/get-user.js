const { object, number } = require('yup');
const extractParams = require('./extract-params');

const schema = object().shape({
  params: object().shape({
    userId: number().positive().integer().required(),
  })
})

module.exports = function init({ sequelize, userService }) {

  async function createUser(req, res, next) {
    try {
      const { params: { userId } } = await extractParams(schema, req);
      const user = await sequelize.transaction(() => {
        return userService.get(userId);
      })
      if (!user) return next();
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  return createUser;
}