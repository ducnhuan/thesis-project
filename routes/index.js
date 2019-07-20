var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
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
  //console.log(req.session.passport.user.rule=="admin");
//   if(req.session.passport.user.rule=="admin"){
//       // console.log("admin");
//       res.cookie('usrName',req.session.passport.user.username); 
//       res.cookie('avatar',req.session.passport.user.avatar);
//       res.cookie('token',req.session.passport.user.token)
//       res.send({rule:req.session.passport.user.rule});
//   }else{
//   // console.log("user")
//  // var avatar=loadAvatar(req.session.passport.user.username);
//   // console.log(req.session.passport.user.avatar)
//       res.cookie('usrName',req.session.passport.user.username); 
//       res.cookie('avatar',req.session.passport.user.avatar);
//       res.cookie('token',req.session.passport.user.token)
//       res.send({rule:req.session.passport.user.rule});
//   }
});

module.exports = router;
