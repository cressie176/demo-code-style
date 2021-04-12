const express = require('express');
const helmet = require('helmet');

async function start() {
  const app = express(helmet());
  return { app };
}

async function stop() {
}

module.exports = {
  start,
  stop,
}