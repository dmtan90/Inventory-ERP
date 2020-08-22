const { AccountModel } = require('../models/account');
const { catchError } = require('../utils/validation');

// get account details
exports.getAccount = async (query) => {
  try {
    const account = await AccountModel.findOne(query)
      // .select('+password')
      .exec();
    return account;
  } catch (err) {
    catchError(err);
  }
};
