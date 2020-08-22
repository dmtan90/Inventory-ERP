const bodyParser = require('body-parser');
const morgan = require('morgan');
const {} = require('../startup/logger');

// Import routes
const accountRoutes = require('../routes/account');
const postRoutes = require('../routes/post');
const logger = require('../startup/logger');

module.exports = (app) => {
  // Setup App Config || Middlewares
  app.use(morgan('combined'));
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use((res, req, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
      return res.status(200).json({});
    }
    next();
  });

  // Routes
  // app.use('/', (req, res, next) => {
  //   return res.status(200).json({
  //     success: true,
  //     message: 'Home Page',
  //   });
  // });
  app.use('/api/account', accountRoutes);
  app.use('/api/post', postRoutes);

  // Handling Error
  app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
  });
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    logger.log('info', error);
    logger.error(error.message, error);
    res.json({
      error: {
        message: error.message,
      },
    });
  });
};
