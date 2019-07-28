const jsforce = require('jsforce');
const conf = require('../config/salesforce')
const authenticate = require('./login');
const localStorage=require('localStorage');
class orderService
{
    static getDetail(id)
    {
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
        var options ={headers:{'Id':id}};
        //console.log(accessToken);
         return new Promise(function(resolve,reject)
          {
              conn.apex.get('/Order',options,function(err,result)
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
        //,function(err,res)
        // {
        //     if(err){return err;}
        //     return res;
        // });
        // var conn= new jsforce.Connection(
        //     {
        //         serverUrl:'https://ap15.lightning.force.com',
        //         accessToken:''
        //     }
        // );
        // var option ={headers:{'Id':id}};
        // return new Promise(function(resolve,reject)
        // {
        //     conn.apex.get('/Order',option, function(err,result)
        //     {
        //         if(err){reject(err);}
        //         else{resolve(result);}
        //     })
        // })
    }
}
module.exports=orderService;