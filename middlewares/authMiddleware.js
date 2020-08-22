const jwt = require('jsonwebtoken');

exports.accountAuth = async (req, res, next) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({
      message: 'Authorization Denied',
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);

    // set account ID as global variable
    res.locals.authID = decoded._id;
    req.authID = decoded._id;
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Authorization Denied',
    });
  }
};

// exports.isAdminAuth = async (req, res, next) => {
//   if (req.accountData.role === 'admin') {
//     return next();
//   }
//   return res.status(401).json({
//     message: 'Authorization Denied',
//   });
// };
