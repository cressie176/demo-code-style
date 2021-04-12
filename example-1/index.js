const init = require('./src/init.js');
const logger = require('./src/logger');
let service;

(async () => {
  try {
    service = init();
    await service.start();
    logger.info('Service started')
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
