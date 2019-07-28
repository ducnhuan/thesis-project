const express=require('express');
const router = express.Router();
const order=require('./orderService');

router.use('/',order);
module.exports=router;