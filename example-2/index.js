const { logger } = require('module-haven-logging');
const init = require('./src/init.js');
let service;

(async () => {
  try {
    service = init();
    await service.start();
    logger.error('Service started')
  } catch (err) {
    logger.error('Service failed to start', err)
  }

  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.once(signal, async () => {
      logger.info(`Received ${signal}, stopping service`);
      if (service) await service.stop();
    })
  })
})();
