const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt =require('jsonwebtoken');

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
    

  return router;
}