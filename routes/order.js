var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/orderDetail', function(req, res, next) {
    console.log(req.query.id);
    res.render('orderDetail',{title:"Auto Payment || Order "+req.query.id});
});

module.exports = router;
