const { logger } = require('../startup/logger');

module.exports = () => {
  if (!process.env.dbURI) {
    logger.log('error', 'Fatal Error: Database URI not define');
    throw Error('Fatal Error: Database URI not define');
  }

  if (!process.env.jwtSecret) {
    logger.log('error', 'Fatal Error: jwtSecret not define');
    throw Error('Fatal Error: jwtSecret not define');
  }

  if (!process.env.tokenExpire) {
    logger.log('error', 'Fatal Error: tokenExpire not define');
    throw Error('Fatal Error: tokenExpire not define');
  }

  if (!process.env.cloudName) {
    logger.log('error', 'Fatal Error: cloudName not define');
    throw Error('Fatal Error: cloudName not define');
  }

  if (!process.env.cloudApiKey) {
    logger.log('error', 'Fatal Error: cloudApiKey not define');
    throw Error('Fatal Error: cloudApiKey not define');
  }

  if (!process.env.cloudSecretKey) {
    logger.log('error', 'Fatal Error: cloudSecretKey not define');
    throw Error('Fatal Error: cloudSecretKey not define');
  }

  if (!process.env.emailUser) {
    logger.log('error', 'Fatal Error: emailUser not define');
    throw Error('Fatal Error: emailUser not define');
  }

  if (!process.env.emailPass) {
    logger.log('error', 'Fatal Error: emailPass not define');
    throw Error('Fatal Error: emailPass not define');
  }
};
