import { getMetamask } from "../connectMetamask.mjs";

//import {getMetamask} from '../connectMetamask.mjs'
var table = new Vue({
    el: '#vue-userView',
    data: {
        searchbar:'',
        filterType:'name',
        orderData:[],
        orderId:'',
        state:["Draft","Activated","Delivering","Completed"],
        ids:[]
    },
    created(){
        this.loadListId()
    },
    methods:{
        loadListId: function(){
            console.log('Hello');
            this.$http.get('/service/getAllOrder')
            .then(response=>
                {
                    response.body.data.forEach(element => {
                        this.ids.push(String(element.orderId));                      
                    });
                    this.loadOrderData();
                },
            response=>{console.log(response);})

        },
        loadOrderData:function()
        {
            //var id = {"id":['8012v000001PcWVAA0','8012v000001PdSrAAK']};
            this.$http.post('/service/api/order/getDetail',{ids:this.ids})
            .then(response=>
                {
                    //console.log(response);
                    response.body.data.forEach(result=>
                        {
                            //console.log(result);
                            //console.log(result.OrderItems.records[0].UnitPrice);
                            var input = {
                                Id: result.Id,
                                Status: result.Status,
                                EffectiveDate:result.EffectiveDate,
                                Total: result.TotalAmount,
                                OrderItems:result.OrderItems,
                                Progress: 25+this.state.indexOf(result.Status)*25,
                                orderProducts: result.OrderItems.records
                            };
                            this.orderData.push(input);});
                }
            ,response=>
            {
                console.log('2');
                var patt= new RegExp("System.QueryException: List has no rows for assignment to SObject");
                if(response.body.err.errorCode=="INVALID_SESSION_ID")
                {
                   setTimeout(function(){this.loadOrderData()}.bind(this),3000);
                }
                else if(patt.test(response.body.message)){alert("The Order Id is non existing. Please try again or contact support.")}
                else{alert('Error occured please contact admin for technical support.')}
            })
        },
        searchOrder:function(){
            console.log(this.orderId);
            window.location.href='/Order/orderDetail?id='+this.orderId
        },
        async sendTransaction(){
            console.log('Load')
            if (window.ethereum) {
                window.web3 = new Web3(ethereum);
                try {
                    // Request account access if needed
                    await ethereum.enable();
                    // Acccounts now exposed
                    console.log(web3.eth.defaultAccount)
                    web3.eth.getTransactionCount(web3.eth.defaultAccount,'pending', (err, txCount) => {
                        // Build the transaction
                        console.log(txCount);
                        web3.eth.sendTransaction({
                            from:web3.eth.defaultAccount,
                            to: '0xE0cb3318D18be98b9ac0f24a64BCAC4E7c22BA4c',
                            value: '1000000000000000000',
                            gas: 2000000,
                            nonce: txCount,
                            chainId: 3
                        },function(error,hash){
                            if(error){console.log(error);}
                            else{console.log(hash);}
                        })

                        });
                    //web3.eth.getAccounts(function(error, accounts) {
                      //  if(error) {
                   //       console.log(error);
                   //     }
                   //     console.log(accounts[0]);
                   //     
                   //     web3.eth.getBalance(
                   //         accounts[0], 
                    //        function (error, result) {
                     //           if(error){console.log(error);}
                    //            else{console.log(result);}
                    //     });
                     //  });
                } catch (error) {
                    // User denied account access...
                }
            }
            // Legacy dapp browsers...
            else if (window.web3) {
                window.web3 = new Web3(web3.currentProvider);
                // Acccounts always exposed
                web3.eth.sendTransaction({/* ... */});
            }
            // Non-dapp browsers...
            else {
                console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
            }
        }
    },
});