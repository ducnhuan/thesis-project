var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const conf = require('../config/salesforce') 


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/test',function(req,res,next){
  res.render('test', { title: 'Express' });
})
var authenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/signin')
  }
}
router.get('/signup', function(req,res,next){
  res.render('auth/signup',{title:"Auto Payment || Sign Up"});
});
router.get('/signin', function(req,res,next){
  res.render('auth/signin',{title:"Auto Payment || Sign In"});
});
router.get('/home',authenticated,function(req,res,next){
  res.render('userhome',{title:"Auto Payment || Home"});
});
router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})
router.get('/redirect',authenticated,function(req,res,next){
  console.log(req.session);
  res.render('index', { title: 'Express' });
});
router.get('/resetPassword',function(req,res,next){
  console.log(req.session);
  res.render('auth/resetPassword', { title: 'Reset Password' });
});
router.get('/setPassword',function(req,res,next){
  console.log(req.session);
  res.render('auth/setNewPass', { title: 'Reset Password' });
});

module.exports = router;
