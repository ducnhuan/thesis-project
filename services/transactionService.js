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
    static updateTotal(id,total)
    {
        return Order.updateOne({orderId:id},{Total: total}).exec();
    }
    static updateAddress(id,address)
    {
        return Order.updateOne({orderId:id},{contractAddress: address}).exec();
    }
}
module.exports = transactionService;