var localStrategy = require('passport-local').Strategy;
var User = require('../models/user')
var googleStrategy = require('passport-google-oauth').OAuth2Strategy;
//const passportJWT = require("passport-jwt");
//const ExtractJWT = passportJWT.ExtractJwt;
var jwt =require('jsonwebtoken');
const conf = require('../config/salesforce') 



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
                               console.log('KEY:'+conf.secretkey);
                               var key = conf.secretkey;
                               done(null,
                                {
                                    lname:doc.lname,
                                    fname:doc.fname,
                                    token : jwt.sign({
                                     email: doc.email,
                                     userID: doc._id,
                                     },key, {expiresIn: '24h'})
                                }) 
                           }
                           else{done(null,false);}
                       }
                       else{done(null,false);} 
                    }
                }) 
        }))

    passport.use(new googleStrategy({
         clientID: "653795520223-qtapkn9auha7i0p0toa3i51ehl3g5qas.apps.googleusercontent.com" ,
         clientSecret:"DUQ9HXA05FEQSqT8zxx0SMjY",
         callbackURL: "https://salesforce-payment.herokuapp.com/auth/signin/google/return"
       },
       function(accessToken, refreshToken, profile, done) {
           console.log(profile.name);
           console.log(profile.id, profile.displayName, profile.emails[0].value)
            //User.findOrCreate({ googleId: profile.id }, function (err, user) {
              //return done(null,profile);
              key = 'googletoken';
              return done(null,
                {
                    lname:profile.name.familyName,
                    fname:profile.name.givenName,
                    email:profile.emails[0].value});
            //});
       }
     ));

}