const havenExpress = require('module-haven-express');
const havenSequelize = require('module-haven-sequelize');
const routes = require('./routes');
const initModel = require('./sequelize/init-model');
const UserService = require('./services/UserService');
const config = require('../config/local');

module.exports = function init() {

  async function start() {

    const { sequelize } = await havenSequelize.start({ config: config.sequelize });
    initModel({ sequelize });

    const { app } = await havenExpress.app.start();

    app.use(havenExpress.middleware.log);

    const userService = new UserService({ sequelize });
    routes({ app, sequelize, userService });

    app.use(havenExpress.middleware.notFound);
    app.use(havenExpress.middleware.error);

    const { server } = await havenExpress.server.start({ config: config.express, app });
    return { app, server }
  }

  async function stop() {
    await havenExpress.server.stop();
    await havenSequelize.stop();
  }

  return {
    start,
    stop,
  }
}