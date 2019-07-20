var localStrategy = require('passport-local').Strategy;
var User = require('../models/user')
var googleStrategy = require('passport-google-oauth').OAuth2Strategy;
//const passportJWT = require("passport-jwt");
//const ExtractJWT = passportJWT.ExtractJwt;
var jwt =require('jsonwebtoken');



module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user)
    })
    passport.deserializeUser(function (user, done){
        done(null, user)  
    })
    passport.use(new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'pwd',
        },
        function (email,password, done) 
        {
            console.log(email +" "+ password);
            User.findOne({email:email},
                function(err,doc)
                {
                    if(err){done(err);}
                    else
                    {
                       if(doc)
                       {
                           var valid = doc.comparePassword(password, doc.password);
                           if(valid)
                           {
                               console.log('log in success');
                               var key = 'secrettoken';
                               done(null,
                                {
                                    lname:doc.lname,
                                    fname:doc.fname,
                                    token : jwt.sign({
                                     email: doc.email,
                                     userID: doc._id,
                                     },key, {expiresIn: '3h'})
                                }) 
                           }
                           else{done(null,false);}
                       }
                       else{done(null,false);} 
                    }
                }) 
        }))

    // passport.use(new googleStrategy({
    //     clientID: "782253470032-29nmibjot6u91u4dmaa64urck3npvuv5.apps.googleusercontent.com" ,
    //     clientSecret:"XGTQMUz1N53_nKDLvtIDrNV0",
    //     callbackURL: "https://motor-forum.herokuapp.com/auth/signin/google/return"
    //   },
    //   function(accessToken, refreshToken, profile, done) {
    //       console.log(profile.id, profile.displayName, profile.emails[0].value)
    //        //User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //          //return done(null,profile);
    //          key = 'googletoken';
    //          return done(null,
    //             {token : jwt.sign({
    //                 username:profile.displayName,
    //                  googleID:profile.id,
    //                  email:profile.emails[0].value}
    //                  ,key,
    //                  {expiresIn: '15m'}) 
    //        });
    //        //});
    //   }
    // ));

}