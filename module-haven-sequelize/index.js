const path = require('path');
const { Sequelize } = require('sequelize');
const Umzug = require('umzug');
const cls = require('cls-hooked');
const { logger } = require('module-haven-logging');

let sequelize;

async function start({ config }) {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
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
  });

  await umzug.up();

  return { sequelize };
}

async function stop() {
  return sequelize.close();
}

module.exports = {
  start,
  stop,
}