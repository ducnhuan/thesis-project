const express = require('express');
const router = express.Router();
const transactionService =require('../../services/transactionService');
const utils = require('../../ultis/ultis');
const conf = require('../../config/salesforce')
const jwt = require('jsonwebtoken');
router.get('/getAllOrder',function(req,res,next)
{
    console.log(req.session);
    var user =jwt.verify(req.session.passport.user.token,conf.secretkey);
    console.log(user);
    return transactionService.getAllOrder(user.userID)
    .then(result=>{res.json(utils.succeed(result));})
    .catch((err)=>{return res.json(utils.fail(err,err.message));})
});


module.exports=router;