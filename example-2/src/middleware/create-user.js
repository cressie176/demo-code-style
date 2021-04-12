const { object, string } = require('yup');
const extractParams = require('./extract-params');

const schema = object().shape({
  body: object().shape({
    firstName: string().required(),
    lastName: string().required(),
  })
})

module.exports = function init({ sequelize, userService }) {

  async function createUser(req, res, next) {
    try {
      const { body: { firstName, lastName } } = await extractParams(schema, req);
      const user = await sequelize.transaction(() => {
        return userService.create({ firstName, lastName })
      })
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  return createUser;
}