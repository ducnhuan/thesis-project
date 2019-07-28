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
            console.log(conn);
            console.log(userInfo);
            //var myValue={accessToken:conn.accessToken};
            //localStorage.setItem('token',JSON.stringify(myValue));
        })
    }
};
exports.data = methods;