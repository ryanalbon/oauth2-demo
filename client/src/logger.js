const pino = require('pino');

const { LOG_LEVEL: level } = require('./config');
const { name: appName, version: appVersion } = require('../package.json');

const logger = pino({ level }).child({ appName, appVersion });

module.exports = logger;
