const _ = require('lodash');
const mongoose = require('mongoose');

const Order = require('../models/transaction')
const User = require('../models/user');
const { ObjectId } = mongoose.Types;
class transactionService
{
    static getAllOrder(email)
    {
        return User.findOne({email:email}).exec()
        .then((res)=>
        {
            return Order.find({userId:res._id}).exec()
        })
    }
    static updateOrder(id,total,date,duration)
    {
        console.log(id+total);
        console.log(date+duration);
        var date1 = new Date(date);
        date1.setDate(date1.getDate()+duration);
        return Order.updateOne({orderId:id},{Total: total,DeliveryDate:date1.getTime()}).exec();
    }
    static updateAddress(id,address)
    {
        return Order.updateOne({orderId:id},{contractAddress: address}).exec();
    }
    static getOne(id)
    {
        return Order.findOne({orderId:id}).exec();
    }
    static getbyAddress(id)
    {
        return Order.findOne({contractAddress:id}).exec();
    }
}
module.exports = transactionService;