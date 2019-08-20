const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt =require('jsonwebtoken');
var mail = require('../services/mailer');

module.exports = function(passport)
{
    router.post('/register',function(req,res)
    {
        //console.log(req.body)
        var body = req.body,
            lname=body.lname,
            fname=body.fname,
            password=body.pwd,
            email=body.email;
        //console.log(lname,fname,password,email);
        User.findOne({email:email},function(err,doc)
        {
            if(err){res.status(500).send('Database Error occured')}
            else
            {
                if(doc){res.status(500).send('Email already used for register. Please try another or reset password!');}
                else
                {
                    var newRecord = new User()
                    newRecord.lname = lname;
                    newRecord.fname = fname;
                    newRecord.password = newRecord.hashPassword(password);
                    newRecord.email = email;
                    //res.send(newRecord);
                    newRecord.save(function(err,user)
                    {
                        if(err){res.status(500).send(err);}
                        else{res.send("Success!!");}
                    })
                }
            }
        })
        //res.send('invalid data')
    })

    router.get('/failure',function(req,res){
        res.status(500).send("Invalid username or password!!")
    })
    //  router.post('/login',passport.authenticate)
    router.post('/login',passport.authenticate('local'),function(req,res)
    {
        console.log(req.user)
        res.send(req.user);
    });
    router.get('/signin/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
    ] }));

    router.get('/signin/google/return', 
    passport.authenticate('google', { failureRedirect: '/signin' }),
    function(req, res) {
        res.redirect('/auth/google');
    });
    router.get('/google',function(req,res)
    {
        console.log(req.session);
        var user= req.session.passport.user;
        User.findOne({email:user.email},function(err,doc)
        {
            if(err){throw err;}
            else
            {
                if(doc)
                {
                    res.redirect('/home');
                }
                else
                {
                    var record = new User()
                    record.lname=user.lname;
                    record.fname=user.fname;
                    record.email=user.email;
                    record.save(function(err,user)
                    {
                        if(err){throw err;}
                        else
                        {
                            User.findOne({email:record.email},function(err,doc)
                            {
                                if(err){res.status(500).send(err);}
                                else
                                {
                                    res.redirect('/home')
                                }
                            })
                        }
                    })
                }
            }
        })
    })
    router.post('/reset',function(req,res)
    {
        var email =req.body.email;
        User.findOne({email:email},function(err,doc)
        {
            if(err){res.status(500).send('Database error.');}
            else
            {
                if(!doc){res.status(500).send('User not found. Please try another email.');}
                else
                {
                    key="passwordtoken";
                    const token=jwt.sign({userId: doc._id},key,{expiresIn:'30m'});
                    mail(email,'Reset password','Please click to the link https://salesforce-payment.herokuapp.com/setPassword?token='+token+' to reset password. This request will expire in 15 minute. Thank you');
                    res.send('Please check your email to reset password!!');
                }
            }
        })
    });
    router.post('/setPassword',function(req,res)
    {   console.log(req.body);
        var token = jwt.verify(req.body.token,"passwordtoken");
        var id= token.userId;
        var record = new User();
        password=record.hashPassword(req.body.pwd);
        User.updateOne({_id:id},{password:password},function(err,doc)
        {
            if(err){res.status(500).send('Error in update database');}
            else
            {
                res.redirect('/signin');
            }
        })
    });

    

  return router;
}