const mongoose = require('mongoose');
const Promise = require('bluebird');
const _ = require('lodash');
const envConf = require('./config/env');
require('./models');
 //const logger = require('./utils/logger');

process.on('uncaughtException', (err) => {
   //logger.info(err);
});

mongoose.Promise = Promise;
const url = 'mongodb://admin:admin123@ds048537.mlab.com:48537/paymentdata';
mongoose.connect(url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  poolSize: 10,
  autoReconnect: true,
  keepAlive: 1,
  connectTimeoutMS: 60 * 60 * 1000,
  socketTimeoutMS: 60 * 60 * 1000,
  reconnectTries: Number.MAX_VALUE,
});

mongoose.connection.on('error', (err) => {
  // logger.error(err);
});

mongoose.set('debug', (collectionName, method, query, doc) => {
  if (process.env.NODE_ENV === 'dev') {
    // logger.debug(`Mongoose: db.${collectionName}.${method}(${JSON.stringify(query)})`);
  }
});
require('./passport/passport');
// Insert default users
_.each(envConf.defaultUsers, (defaultUser) => {
  mongoose
    .model('user')
    .findOne({ email: defaultUser.email })
    .exec()
    .then((result) => {
      if (!result) {
        return mongoose.model('user').create(defaultUser);
      }
      const user = result;
      if (user.email == 'admin@team1.com') {
        user.userType = 'admin';
        return user.save();
      }
      return Promise.resolve(user);
    })
    .catch((err) => {
      // logger.error(err);
    });
});

module.exports = {};
