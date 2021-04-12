const { User } = require('../model');

class UserService {

  constructor({ sequelize }) {
    this._sequelize = sequelize;
  }

  async create(user) {
    return User.create(user, {
      returning: true
    });
  }

  async get(id) {
    return User.findByPk(id)
  }

  async list({ offset = 0, limit = 10 }) {
    const where = {};
    return User.findAll({
      where,
      order: [['firstName', 'ASC']],
      limit,
      offset,
    });
  }

}

module.exports = UserService;