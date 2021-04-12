let server;

async function start({ config, app }) {
  return new Promise((resolve, reject) => {
    server = app.listen(config.port, config.host, (err) => {
      return err ? reject(err) : resolve({ app });
    });
  });
}

async function stop() {
  return new Promise((resolve, reject) => {
    server.close((err) => {
      return err ? reject(err) : resolve();;
    });
  })
}

module.exports = {
  start,
  stop,
}