const express = require('express');
const router = express.Router();
const orderService =require('../../services/orderService');
const utils = require('../../ultis/ultis');
const request = require('request');
var transactionService = require('../../services/transactionService')
var contractService = require('../../services/contracService');
var conf = require('../../config/ethereum');
const {abi, evm} = require('../../services/compile');
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
            console.log('Date:'+result.EffectiveDate);
            console.log('Duration:'+result.Duration__c);
            transactionService.updateOrder(ids,result.TotalAmount,result.EffectiveDate,result.Duration__c);
            res.json(utils.succeed(result));
        })
    })
    .catch((err)=>{
        console.log('ERROR'+err);
        return res.status(500).json(utils.fail(err,err.message));})
})
router.post('/api/order/changeState',function(req,res)
{
    console.log(req.body)
    orderService.changeState(req.body.Id,req.body.State)
      .then(result =>{
          console.log('Result');
          res.json(utils.succeed(result));
         })
      .catch((err)=>{
          console.log('ERROR'+err);
          return res.status(500).json(utils.fail(err,err.message));})
})

router.post('/api/order/ConfirmOrder',function(req,res)
{   
    let wss = req.app.get('wss');
    transactionService.getOne(req.body.Id)
    .then(result=>{
        console.log(result);
        let data= {url:'wss://'+req.get('host'), id:req.body.Id};
        res.json(utils.succeed(data));
        contractService.deployContract(result.Total*1000000000000000000,conf.percent,result.DeliveryDate)
        .then((result1)=>{
            transactionService.updateAddress(req.body.Id,result1);
            wss.clients.forEach(ws=>{
                console.log(ws.id);
                if(ws.id==result.orderId)
                {
                    ws.send(JSON.stringify({status:'successful',data:{contractAddress:result1,total:result.Total}}));
                    ws.close();
                }
            })
        })
        .catch((err)=>{
            wss.clients.forEach(ws=>{
                console.log(ws.id);
                if(ws.id==result.orderId)
                {
                    ws.send(JSON.stringify({status:'failed',message:err.message}));
                    ws.close();
                }
            })
        })   
    })
    .catch((err)=>{return res.status(500).json(utils.fail(err,err.message));})
    
})
router.post('/api/order/ActiveOrder',function(req,res)
{
    transactionService.getbyAddress(req.body.Address)
    .then(result=>{
        console.log(result);
        contractService.confirmContract(req.body.Address)
        .then(result1=>
            {
                if(result1.check==true)
                {
                    console.log('Activated')
                    orderService.changeState(result.orderId,'Activated')
                    .then(resul =>{
                        console.log('Result');
                        res.json(utils.succeed(resul));
                       })
                    .catch((err)=>{
                        console.log('ERROR'+err);
                        return res.status(500).json(utils.fail(err,err.message));})
                }
            })
        .catch(error=>
            {
                console.log('Error return'+error);
                return res.status(500).json(utils.fail(error,error.message));
            })
    })
    .catch((err)=>{return res.status(500).json(utils.fail(err,err.message));})
})
router.post('/api/order/ContractInfo',function(req,res)
{
    transactionService.getOne(req.body.Id)
    .then((result)=>
    {
        console.log(result);
        var resp ={
            OrderId: result.orderId,
            ContractAddress: result.contractAddress,
            ContractABI:abi
        };
        res.json(utils.succeed(resp));
    })
    .catch((err)=>
    {
        console.log('Error return'+err);
        return res.status(500).json(utils.fail(err,err.message));  
    })
})
router.post('/api/order/CancelContract',function(req,res)
{
    if(req.body.contract != '')
    {
        contractService.cancelContract(req.body.contract)
        .then(result1=>
        {
            console.log(result1);
            if(result1.check==true)
            {
                console.log('Cancel')
                orderService.changeState(req.body.OrderId,'Cancel')
                .then(resul =>{
                    console.log('Result');
                    res.json(utils.succeed(resul));
                })
                .catch((err)=>{
                    console.log('ERROR'+err);
                    return res.status(500).json(utils.fail(err,err.message));})
            }
        })
        .catch(error=>
        {
            console.log('Error return'+error);
            return res.status(500).json(utils.fail(error,error.message));
        })
        
    }
    else{
        transactionService.getOne(req.body.OrderId)
    .then((result)=>
    {
        if(result.contractAddress=='')
        {
            orderService.changeState(req.body.OrderId,'Cancel')
                .then(resul =>{
                    console.log('Result');
                    res.json(utils.succeed(resul));
                })
                .catch((err)=>{
                    console.log('ERROR'+err);
                    return res.status(500).json(utils.fail(err,err.message));})
        }
    })
    .catch((err)=>
    {
        console.log('Error return'+err);
        return res.status(500).json(utils.fail(err,err.message));  
    })

    }

})
router.post('/api/order/completeContract',function(req,res)
{
    console.log('Complete'+req.body.contract);
    contractService.CompleteContract(req.body.contract)
    .then(result1=>
    {
        console.log(result1);
        if(result1.check==true)
        {
            console.log('Complete')
            orderService.changeState(req.body.OrderId,'Completed')
            .then(resul =>{
                console.log('Result'+resul);
                res.json(utils.succeed(resul));
            })
            .catch((err)=>{
                console.log('ERROR'+err);
                return res.status(500).json(utils.fail(err,err.message));})
        }
    })
    .catch(error=>
    {
        console.log('Error return'+error);
        return res.status(500).json(utils.fail(error,error.message));
    })

})
router.post('/api/order/reportContract',function(req,res)
{
    contractService.ReportContract(req.body.contract)
    .then(result1=>
    {
        console.log(result1);
        if(result1.check==true)
        {
            console.log('Report')
            orderService.changeState(req.body.OrderId,'Cancel')
            .then(resul =>{
                console.log('Result');
                res.json(utils.succeed(resul));
            })
            .catch((err)=>{
                console.log('ERROR'+err);
                return res.status(500).json(utils.fail(err,err.message));})
        }
    })
    .catch(error=>
    {
        console.log('Error return'+error);
        return res.status(500).json(utils.fail(error,error.message));
    })

})
router.post('/api/order/SellerDeliveryContract',function(req,res)
{
    transactionService.getOne(req.body.OrderId)
    .then((result)=>{
        console.log(result);
        contractService.sellerDeliveryContract(result.contractAddress)
        .then((result1)=>
        {
            console.log(result1);
            var resp ={
                OrderId: req.body.OrderId,
                ContractAddress: result.contractAddress,
                State:"Successful"
            };
            res.json(utils.succeed(resp));
            
        })
        .catch(error=>
            {
                console.log('Error return'+error);
                return res.status(500).json(utils.fail(error,error.message));
            })

    })
    .catch(err=>{
        console.log('Error return'+err);
        return res.status(500).json(utils.fail(err,err.message));
    })
})
router.post('/api/order/SellerCancelContract',function(req,res)
{
    transactionService.getOne(req.body.OrderId)
    .then((result)=>{
        console.log(result);
        contractService.sellerCancelContract(result.contractAddress)
        .then((result1)=>
        {
            console.log(result1);
            var resp ={
                OrderId: req.body.OrderId,
                ContractAddress: result.contractAddress,
                State:"Successful"
            };
            res.json(utils.succeed(resp));
            
        })
        .catch(error=>
            {
                console.log('Error return'+error);
                return res.status(500).json(utils.fail(error,error.message));
            })

    })
    .catch(err=>{
        console.log('Error return'+err);
        return res.status(500).json(utils.fail(err,err.message));
    })
})
router.post('/api/order/test',function(req,res)
{
    console.log(req.body);
    orderService.changeState(req.body.OrderId,'Completed')
    .then(resul =>{
        console.log('Result'+resul);
        res.json(utils.succeed(resul));
    })
    .catch((err)=>{
        console.log('ERROR'+err);
        return res.status(500).json(utils.fail(err,err.message));})
})
module.exports=router;
