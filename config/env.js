const env = process.env.NODE_ENV || 'dev';
const _ = require('lodash');

const defaultConfig = {
  defaultUsers: [{
    lname: 'Nguyen',
    fname: 'Nhuan',
    email: 'admin@team1.com',
  }],
};

const config = {
  test: {
    mongodb: 'mongodb://admin:admin123@ds048537.mlab.com:48537/paymentdata',
  },
  dev: {
    mongodb: 'mongodb://admin:admin123@ds048537.mlab.com:48537/paymentdata',
  },
  prod: {
    mongodb: 'mongodb://admin:admin123@ds048537.mlab.com:48537/paymentdata',
  },
};

module.exports = _.merge(defaultConfig, config[env]);
