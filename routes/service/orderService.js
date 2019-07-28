const express = require('express');
const router = express.Router();
const orderService =require('../../services/orderService');
const utils = require('../../ultis/ultis');

router.get('/api/order/getDetail/:id',(req,res)=>{
    const id= req.params.id;
    //console.log('1');
    //console.log(id);
    orderService.getDetail(id)
    .then(result =>{res.json(utils.succeed(result));})
    .catch((err)=>{res.json(utils.fail(err,err.message));})
    
})

module.exports=router;