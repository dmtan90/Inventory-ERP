const mongoose = require('mongoose');
const { logger } = require('../startup/logger');
// Setup App DB
module.exports = async () => {
  try {
    console.log(process.env.dbURI);
    const db = await mongoose.connect(process.env.dbURI, {
      useNewUrlParser: true,
      // useUnifiedTopology: true,
      useCreateIndex: true,
      // useFindAndModify: false,
    });
    if (db) {
      console.log(db);
    }

    logger.log('info', 'MongoDB Connected.....');
  } catch (err) {
    logger.log('error', err.message);
    logger.error('error', 'MongoDB Connection Failed.....', err);
    throw Error(err);
    // process.exit(1);
  }
};
