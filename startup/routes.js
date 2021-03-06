const bodyParser = require('body-parser');
const morgan = require('morgan');
const { logger } = require('../startup/logger');

// Import routes
const accountRoutes = require('../routes/account');
const storeRoutes = require('../routes/store');
const categoryRoutes = require('../routes/category');
const sizeRoutes = require('../routes/size');
const colorRoutes = require('../routes/color');
const brandRoutes = require('../routes/brand');
const couponRoutes = require('../routes/coupon');
const productRoutes = require('../routes/product');
const postRoutes = require('../routes/post');

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
  app.use('/api/account', accountRoutes);
  app.use('/api/store', storeRoutes);
  app.use('/api/category', categoryRoutes);
  app.use('/api/size', sizeRoutes);
  app.use('/api/color', colorRoutes);
  app.use('/api/brand', brandRoutes);
  app.use('/api/coupon', couponRoutes);
  app.use('/api/product', productRoutes);
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
