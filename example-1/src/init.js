const path = require('path');
const express = require('express');
const helmet = require('helmet');
const routes = require('./routes');
const HttpError = require('./HttpError');
const { Sequelize } = require('sequelize');
const Umzug = require('umzug');
const cls = require('cls-hooked');
const initModel = require('./sequelize/init-model');
const UserService = require('./services/UserService');
const logger = require('./logger');

module.exports = function init() {

  let server;
  let sequelize;

  async function start() {
    const app = express(helmet());

    sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
      host: 'localhost',
      dialect: 'postgres',
      logging: msg => logger.info(msg),
      define: {
        freezeTableName: true,
      }
    });

    const namespace = cls.createNamespace('transaction');
    Sequelize.useCLS(namespace);

    const umzug = new Umzug({
      migrations: {
        path: path.join(process.cwd(), './migrations'),
        params: [
          sequelize.getQueryInterface()
        ]
      },
      storage: 'sequelize',
      storageOptions: {
        sequelize: sequelize
      }
    })

    await umzug.up();

    initModel({ sequelize });

    const userService = new UserService();

    app.use((req, res, next) => {
      res.once('finish', function() {
        logger.info(`${req.originalUrl} ${this.statusCode}`, {
          path: req.route.path,
          params: req.params,
          statusCode: this.statusCode,
         })
      })
      next();
    })

    routes({ app, sequelize, userService });

    app.use((req, res, next) => {
      next(new HttpError({ code: 404 }));
    });

    app.use((err, req, res, next) => {
      const code = err instanceof HttpError ? err.code : 500;
      logger.error(err);
      res.status(code).json({ message: `Error ${code}` });
    })

    return new Promise((resolve, reject) => {
      server = app.listen(3000, '0.0.0.0', (err) => {
        return err ? reject(err) : resolve({ app });
      });
    })
  }

  async function stop() {
    return new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) return reject(err);
        sequelize.close().then(resolve).catch(reject);
      });
    })
  }

  return {
    start,
    stop,
  }
}