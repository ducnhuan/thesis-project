const express = require('express');
const router = express.Router();
const orderService =require('../../services/orderService');
const utils = require('../../ultis/ultis');
const request = require('request');
router.get('/api/order/getDetail/:id',function(req,res)
{
    var ids=[];
    ids.push(req.params.id);
    //var ids=['8012v000001PcWVAA0','8012v000001PdSrAAK'];
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
router.post('/api/order/getDetail',function(req,res)
{
    //var ids=[];
    //ids.push(req.params.id);
    console.log(req.body)
    //var ids=['8012v000001PcWVAA0','8012v000001PdSrAAK'];
    //console.log(req.body.ids===ids)
    //console.log('1');
    //console.log(id);
     orderService.getDetail(req.body.ids)
     .then(result =>{
         console.log('Result');
         res.json(utils.succeed(result));
        })
     .catch((err)=>{
         console.log('ERROR');
         return res.status(500).json(utils.fail(err,err.message));})
})

router.get('/api/order/getInfo/:id',function(req,res)
{
    var ids=req.params.id;
    //var ids=['8012v000001PcWVAA0','8012v000001PdSrAAK'];
    //console.log('1');
    //console.log(id);
    orderService.getInfo(ids)
    .then(result =>{
        request('https://api.cryptonator.com/api/ticker/usd-eth', function(error,response,body)
        {
            var bodyJSON = JSON.parse(body);
            result.TotalAmount= parseFloat((result.TotalAmount*bodyJSON.ticker.price/1000).toFixed(5));
            res.json(utils.succeed(result));
        })
    })
    .catch((err)=>{
        console.log('ERROR');
        return res.status(500).json(utils.fail(err,err.message));})
})
router.post('/api/order/changeState',function(req,res)
{
    //var ids=[];
    //ids.push(req.params.id);
    console.log(req.body)
    //var ids=['8012v000001PcWVAA0','8012v000001PdSrAAK'];
    //console.log(req.body.ids===ids)
    //console.log('1');
    // //console.log(id);
    orderService.changeState(req.body.Id,req.body.State)
      .then(result =>{
          console.log('Result');
          res.json(utils.succeed(result));
         })
      .catch((err)=>{
          console.log('ERROR'+err);
          return res.status(500).json(utils.fail(err,err.message));})
})
module.exports=router;