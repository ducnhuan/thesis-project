const express = require('express');
const router = express.Router();
const orderService =require('../../services/orderService');
const utils = require('../../ultis/ultis');

router.get('/api/order/getDetail/:id',function(req,res)
{
    var ids=[];
    ids.push(req.params.id);
    //console.log('1');
    //console.log(id);
    orderService.getDetail(ids)
    .then(result =>{
        console.log('Result');
        res.json(utils.succeed(result));})
    .catch((err)=>{
        console.log('ERROR');
        return res.status(500).json(utils.fail(err,err.message));})
})

module.exports=router;