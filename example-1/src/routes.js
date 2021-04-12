const express = require('express');
const middleware = require('./middleware');

module.exports = function({ app, sequelize, userService }) {

  const apiRouter = express.Router();
  apiRouter.use(express.json());
  apiRouter.post('/users', middleware.createUser({ sequelize, userService }));
  apiRouter.get('/users', middleware.listUsers({ sequelize, userService }));
  apiRouter.get('/users/:userId', middleware.getUser({ sequelize, userService }));

  app.use('/api', apiRouter);

  return app;
}
