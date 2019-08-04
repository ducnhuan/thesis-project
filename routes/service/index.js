const express=require('express');
const router = express.Router();
const order=require('./orderService');
const transaction = require('./transaction');

router.use('/',order);
router.use('/',transaction);
module.exports=router;