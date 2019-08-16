const Web3 = require('web3')
const {abi, evm} = require('./compile');
var conf = require('../config/ethereum')
const web3 = new Web3(conf.httpProvider);
class contractService
{
    static deployContract(total,percent,date)
    {
        var contract = web3.eth.Contract(abi);
        var contractData = contract.deploy({
            data:'0x'+evm.bytecode.object,
            arguments: [web3.utils.toHex(total),date]
        })
        .encodeABI();
        return new Promise(function(resolve,reject)
        {
           web3.eth.getGasPrice(function(err,gasPrice)
           {
               if(err){reject(err);}
               else
               {
                web3.eth.getTransactionCount(conf.account1,'pending',(err,txCount)=>
                {
                    if(err){reject(err);}
                    else
                    {
                        web3.eth.accounts.signTransaction({
                            from:conf.account1,
                            gas: 1200000,
                            gasPrice:gasPrice,
                            nonce:txCount,
                            data:contractData,
                            value:web3.utils.toHex(total*percent/100),
                            chainId:3
                        },conf.privateKey1,
                        (err,result)=>
                        {
                            if(err){reject(err);}
                            else
                            {
                                web3.eth.sendSignedTransaction(result.rawTransaction)
                                .on('transactionHash',function(hash){console.log('Hash'+hash);})
                                .on('confirmation',function(confirmationNumber, receipt)
                                    {
                                        console.log('Confirm'+confirmationNumber+receipt.contractAddress);
                                        resolve(receipt.contractAddress);
                                    })
                                .on('error',function(err){console.log('Error:'+err);
                                                          reject(err);})
                            }
                        })
                    }
                })
               }
           }) 
        })
    }
    static confirmContract(address)
    {
        const web3 = new Web3(conf.webSocketProvider);
        var MyContract =  web3.eth.Contract(abi,address);
        return new Promise(function(resolve,reject)
        {
            MyContract.once('Activate', { // Using an array means OR: e.g. 20 or 23
                fromBlock: 0
            }, function(error, event)
            { 
                if(error){reject(error);}
                else
                {
                    resolve(event.returnValues);
                }
            });

        });
    }
    static cancelContract(address)
    {
        console.log(address);
        const web3 = new Web3(conf.webSocketProvider);
        var MyContract =  web3.eth.Contract(abi,address);
        return new Promise(function(resolve,reject)
        {
            MyContract.once('Cancel', { // Using an array means OR: e.g. 20 or 23
                fromBlock: 0
            }, function(error, event)
            { 
                if(error){reject(error);}
                else
                {
                    //console.log(event);
                    resolve(event.returnValues);
                }
            });
        });
    }
    static ReportContract(address)
    {
        console.log(address);
        const web3 = new Web3(conf.webSocketProvider);
        var MyContract =  web3.eth.Contract(abi,address);
        return new Promise(function(resolve,reject)
        {
            MyContract.once('Report', { // Using an array means OR: e.g. 20 or 23
                fromBlock: 0
            }, function(error, event)
            { 
                if(error){reject(error);}
                else
                {
                    //console.log(event);
                    resolve(event.returnValues);
                }
            });
        });
    }

}
module.exports=contractService;
