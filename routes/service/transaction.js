const express = require('express');
const router = express.Router();
const transactionService =require('../../services/transactionService');
const utils = require('../../ultis/ultis');
const conf = require('../../config/salesforce')
const jwt = require('jsonwebtoken');
router.get('/getAllOrder',function(req,res,next)
{
    //console.log(req.session);
    var email =req.session.passport.user.email;
    //console.log(email);
    return transactionService.getAllOrder(email)
    .then(result=>{res.json(utils.succeed(result));})
    .catch((err)=>{return res.json(utils.fail(err,err.message));})
});


module.exports=router;