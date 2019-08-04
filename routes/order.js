var express = require('express');
var router = express.Router();
var Order = require('../models/transaction');
var jwt = require('jsonwebtoken');
var conf =require('../config/salesforce')
/* GET users listing. */
router.get('/orderDetail', function(req, res, next) {
    console.log(req.query.id);
    if(req.isAuthenticated())
    {
        res.render('userOrderDetail',{title:"Auto Payment || Order "+req.query.id});
    }
    else
    {
        res.render('orderDetail',{title:"Auto Payment || Order "+req.query.id});
    }
    
});
router.post('/addOrder',function(req,res,next)
{
    var user = jwt.verify(req.session.passport.user.token,conf.secretkey);
    var orderId = req.body.id;
    Order.findOne({orderId:orderId},function(err,doc)
    {
        if(err){res.status(500).send('Database Error occured');}
        else
        {
            if(doc){res.status(500).send('Order have already added by another user.');}
            else
            {
                var newRecord = new Order()
                newRecord.orderId= orderId;
                newRecord.userId= user.userID;
                newRecord.save(function(err,order)
                {
                    if(err){res.status(500).send(err);}
                    else{res.send("Success!!");}
                })
            }
        }
    })
    console.log(user);
    console.log(orderId); 
});

module.exports = router;
