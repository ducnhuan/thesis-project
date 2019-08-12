const path = require('path');
const fs = require('fs');
const solc = require('solc');

const auctionPath = path.resolve(__dirname, '../contracts', 'Contract.sol');
//console.log(auctionPath);
const source = fs.readFileSync(auctionPath, 'utf8');
//console.log(source);
//const output = solc.compile(source.toString(),1);
//console.log(output);
//console.log('bytecode: ',output.contracts);
const jsonContract = JSON.stringify({
     language: 'Solidity', 
     sources:{
         'Demo': {
             content:source,
         },
     },
     settings:{
         outputSelection: {
             '*':{
                 '*':['abi',"evm.bytecode"],
             },
         },
     },
 });
module.exports = JSON.parse(solc.compile(jsonContract)).contracts.Demo.Demo;