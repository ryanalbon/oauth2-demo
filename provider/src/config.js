const config = {
  HOST: process.env.HOST || '0.0.0.0',
  PORT: process.env.HOST || 5000,

  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  DB_URL: process.env.DB_URL || 'mongodb://127.0.0.1:27017/oauth2_provider_db',
  DB_NAME: process.env.DB_NAME || 'oauth2_provider_db',
};

module.exports = config;
