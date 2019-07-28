const jsforce = require('jsforce');
const conf = require('../config/salesforce')
const localStorage = require('localStorage');
//const callback = require('./orderService')
var methods={
    salesforcelogin: function()
    {
        var conn= new jsforce.Connection(
            {
                loginUrl:conf.loginUrl
            });
        conn.login(conf.userName,conf.password,function(err,userInfo)
        {
            if(err){return console.log(err)}
            var myValue={accessToken:conn.accessToken};
            localStorage.setItem('token',JSON.stringify(myValue));
        })
    }
};
exports.data = methods;