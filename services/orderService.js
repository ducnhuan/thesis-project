const jsforce = require('jsforce');
const conf = require('../config/salesforce')
const authenticate = require('./login');
const localStorage=require('localStorage');
class orderService
{
    static getDetail(id)
    {
        console.log(id);
        var myValue=JSON.parse(localStorage.getItem('token'));
        var token;
        if(myValue==null)
        {
            token=conf.accessToken
        }
        else{token=myValue.accessToken};
        var conn=new jsforce.Connection({
            serverUrl:conf.loginUrl,
            accessToken:token
        })
        var body ={"ID":id};
        //console.log(accessToken);
         return new Promise(function(resolve,reject)
          {
              conn.apex.post('/Order',body,function(err,result)
              {
                  if(err){
                      if(err=='INVALID_SESSION_ID: Session expired or invalid')
                      {
                          console.log('Error1');
                          authenticate.data.salesforcelogin();
                          reject(err);
                      }
                      else{reject(err);}
                  }
                  else{resolve(result);}
              })
          })
    }
    static getInfo(id)
    {
        console.log(id);
        var myValue=JSON.parse(localStorage.getItem('token'));
        var token;
        if(myValue==null)
        {
            token=conf.accessToken
        }
        else{token=myValue.accessToken};
        var conn=new jsforce.Connection({
            serverUrl:conf.loginUrl,
            accessToken:token
        })
        var body ={"ID":id};
        return new Promise(function(resolve,reject)
        {
            conn.apex.post('/Order/Info',body,function(err,result)
            {
                if(err){
                    if(err=='INVALID_SESSION_ID: Session expired or invalid')
                    {
                        console.log('Error1');
                        authenticate.data.salesforcelogin();
                        reject(err);
                    }
                    else{reject(err);}
                }
                else{resolve(result);}
            })

        })
    }
    static changeState(id,state)
    {
        console.log(id);
        var myValue=JSON.parse(localStorage.getItem('token'));
        var token;
        if(myValue==null)
        {
            token=conf.accessToken
        }
        else{token=myValue.accessToken};
        var conn=new jsforce.Connection({
            serverUrl:conf.loginUrl,
            accessToken:token
        })
        var body ={"ID":id,"State":state};
        return new Promise(function(resolve,reject)
        {
            conn.apex.post('/Order/State',body,function(err,result)
            {
                if(err){
                    if(err=='INVALID_SESSION_ID: Session expired or invalid')
                    {
                        console.log('Error1');
                        authenticate.data.salesforcelogin();
                        reject(err);
                    }
                    else{reject(err);}
                }
                else{resolve(result);}
            })

        })
    }
}
module.exports=orderService;