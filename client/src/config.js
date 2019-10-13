const config = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  HOST: process.env.HOST || '0.0.0.0',
  PORT: process.env.PORT || 5010,
  DB_URL: process.env.DB_URL || 'mongodb://127.0.0.1:27017/oauth2_client_db',
  DB_NAME: process.env.DB_NAME || 'oauth2_client_db',
};

module.exports = config;
