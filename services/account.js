const { AccountModel } = require('../models/account.model');
const { catchError } = require('../utils/validation');

// get account details
exports.getAccount = async (query) => {
  try {
    const account = await AccountModel.findOne(query)
      // .select('+password')
      .exec();
    return account;
  } catch (err) {
    catchError(err, 'Account Not Found');
  }
};
