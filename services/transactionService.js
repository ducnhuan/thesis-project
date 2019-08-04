const _ = require('lodash');
const mongoose = require('mongoose');

const Order = require('../models/transaction')

const { ObjectId } = mongoose.Types;
class transactionService
{
    static getAllOrder(id)
    {
        return Order.find({userId:id}).exec();
    }
}
module.exports = transactionService;