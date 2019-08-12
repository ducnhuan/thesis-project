const Web3 = require('web3')
const web3 = new Web3('HTTP://127.0.0.1:7545');
const {abi, evm} = require('./compile');
var conf = require('../config/ethereum')
class contractService
{
    static deployContract(address,total,penalty)
    {
        var contract = web3.eth.Contract(abi);
        var contractData = contract.deploy({
            data:'0x'+evm.bytecode.object,
            arguments: ['0x2c1a7F35539E19285ae61D9388E4fd0d77836c1b',web3.utils.toHex(5000000000000000000),web3.utils.toHex(10)]
        })
        .encodeABI();
        return new Promise(function(resolve,reject)
        {
           web3.eth.getGasPrice(function(err,gasPrice)
           {
               if(err){reject(err);}
               else
               {
                web3.eth.getTransactionCount(conf.account,'pending',(err,txCount)=>
                {
                    if(err){reject(err);}
                    else
                    {
                        web3.eth.accounts.signTransaction({
                            from:conf.account,
                            gas: 1000000,
                            gasPrice:gasPrice,
                            nonce:txCount,
                            data:contractData,
                            chainId:3
                        },conf.privateKey,
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
}
module.exports=contractService;
//console.log(abi);
//console.log(evm);