//import {getMetamask} from '../connectMetamask.mjs'
var table = new Vue({
    el: '#vue-userView',
    data: {
        searchbar:'',
        filterType:'name',
        orderData:[],
        orderId:'',
        state:["Draft","Activated","Delivering","Completed"],
        ids:[],
        element:'',
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
                                Duration:result.Duration__c,
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
        confirmContract:function(address)
        {
            this.$http.post('/service/api/order/ActiveOrder',{Address:address})
            .then(response=>
                {
                    //return response;
                    if(response.body.status=="successful")
                    {
                        alert("Your order is activated. Please check your inbox for confirm email. Thank you!!");
                        this.orderData=[];
                        this.loadOrderData();
                    }
                    //this.sendTransaction(response.body.data,this.element.Total);
                },response=>
                {
                    console.log(response);
                    //return response;
                });
        },
        reportButton:function(Id)
        {
            console.log('Report');
            // console.log(Date.now());
            // console.log(new Date().getTime());
            // console.log(new Date("2019-08-16").getTime());
            // var d= new Date();
            // d.setTime(new Date("2019-08-16").getTime());
            // console.log(d.toString());
            this.$http.post('/service/api/order/ContractInfo',{Id:Id})
            .then(response=>{
                console.log(response);
                this.reportTransaction(response.body.data.ContractAddress,response.body.data.ContractABI,Date.now())
                .then(()=>{
                    this.$http.post('/service/api/order/reportContract',{OrderId:response.body.data.OrderId,contract:response.body.data.ContractAddress})
                    .then(response1=>
                    {
                        if(response1.body.status=="successful")
                        {
                            alert("Your order is cancel. Please check your inbox for confirm email. Thank you!!");
                            this.orderData=[];
                            this.loadOrderData();
                        }
                    },response1=>
                    {
                        console.log("Error"+response1);
                    })
                })
            },response=>{
                console.log('Error'+response);
            })
        },
        completeButton:function(Id)
        {
            console.log('Complete');
            // console.log(Date.now());
            // console.log(new Date().getTime());
            // console.log(new Date("2019-08-16").getTime());
            // var d= new Date();
            // d.setTime(new Date("2019-08-16").getTime());
            // console.log(d.toString());
            this.$http.post('/service/api/order/ContractInfo',{Id:Id})
            .then(response=>{
                console.log(response);
                this.completeTransaction(response.body.data.ContractAddress,response.body.data.ContractABI)
                .then(()=>{
                    this.$http.post('/service/api/order/completeContract',{OrderId:response.body.data.OrderId,contract:response.body.data.ContractAddress})
                    .then(response1=>
                    {
                        console.log(response1);
                        if(response1.body.status=="successful")
                        {
                            alert("Your order is completed. Please check your inbox for confirm email. Thank you!!");
                            this.orderData=[];
                            this.loadOrderData();
                        }
                    },response1=>
                    {
                        console.log("Error"+response1);
                    })
                })
            },response=>{
                console.log('Error'+response);
            })
        },
        cancelButton:function(Id)
        {
            console.log('Cancel');
            this.$http.post('/service/api/order/ContractInfo',{Id:Id})
            .then(response=>
                {
                    if(response.body.data.ContractAddress!="")
                    {
                        this.cancelTransaction(response.body.data.ContractAddress,response.body.data.ContractABI)
                        .then(()=>{
                            this.$http.post('/service/api/order/CancelContract',{OrderId:response.body.data.OrderId,contract:response.body.data.ContractAddress})
                            .then(response1=>
                                {
                                    if(response1.body.status=="successful")
                                    {
                                        alert("Your order is cancel. Please check your inbox for confirm email. Thank you!!");
                                        this.orderData=[];
                                        this.loadOrderData();
                                    }
                                },response1=>
                                {
                                    console.log("Error"+response1);
                                })
                        })
                    }
                    else 
                    {
                        this.$http.post('/service/api/order/CancelContract',{OrderId:response.body.data.OrderId,contract:response.body.data.ContractAddress})
                        .then(response1=>
                            {
                                if(response1.body.status=="successful")
                                {
                                    alert("Your order is cancel. Please check your inbox for confirm email. Thank you!!");
                                    this.orderData=[];
                                    this.loadOrderData();
                                }
                            },response1=>
                            {
                                console.log("Error"+response1);
                            })
                    }
                },response=>
                {
                    console.log(response);
                    //return response;
                });
        },
        searchOrder:function(){
            console.log(this.orderId);
            window.location.href='/Order/orderDetail?id='+this.orderId
        },
        confirmOrder:function()
        {
            $('#confirmModal').modal('hide');
            console.log(this.element.Id);
            this.$http.post('/service/api/order/ConfirmOrder',{Id:this.element.Id})
            .then(response=>
                {
                    console.log(response.body.data+this.element.Total);
                    this.sendTransaction(response.body.data,this.element.Total)
                    .then(()=>{console.log('111111111Runfin');
                               this.confirmContract(response.body.data);
                                });
                },response=>
                {
                    console.log(response);
                });
        },
        activeButton:function(id)
        {
            this.$http.get('/service/api/order/getInfo/'+id)
            .then(response=>
                {
                    var input = {
                        Id: response.body.data.Id,
                        Status: response.body.data.Status,
                        EffectiveDate:response.body.data.EffectiveDate,
                        Total: response.body.data.TotalAmount
                    };
                    this.element=input;
                    console.log(this.element);
                    $('#confirmModal').modal('show');
                },
            
            response=>{console.log('ERROR'+response);})
        },
        async sendTransaction(contractAddress,total){
            console.log('Load')
            if (window.ethereum) {
                window.web3 = new Web3(ethereum);
                try {
                    // Request account access if needed
                    await ethereum.enable();
                    // Acccounts now exposed
                    console.log(web3.eth.defaultAccount)
                    web3.eth.getGasPrice(function(err,gasPrice)
                    {
                        if(err){console.log(err);}
                        else
                        {
                            console.log(gasPrice);
                        }
                    })
                    web3.eth.getTransactionCount(web3.eth.defaultAccount,'pending', (err, txCount) => {
                        // Build the transaction
                        console.log(txCount);
                        web3.eth.sendTransaction({
                            from:web3.eth.defaultAccount,
                            to: contractAddress,
                            value:total*1000000000000000000,
                            gas: 100000,
                            gasPrice:20000000000,
                            nonce: txCount,
                            chainId: 4777
                        },function(err, transactionHash)
                        {
                            if(!err)
                            {
                                console.log(transactionHash);
                                console.log(contractAddress);
                            }
                        });
                    });
                } catch (error) {
                    console.log(error);
                }
            }
            else {
                console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
            }
        },
        async cancelTransaction(contractAddress,abi){
            console.log('Cancel contract');
            console.log(contractAddress);
            console.log(abi);
            if (window.ethereum) {
                window.web3 = new Web3(ethereum);
                try {
                    // Request account access if needed
                    await ethereum.enable();
                    // Acccounts now exposed
                    console.log(web3.eth.defaultAccount)
                    var contract = web3.eth.contract(abi).at(contractAddress); 
                    contract.cancelContract({ from: web3.eth.defaultAccount, gas: 45000 },
                        (err, res) => { if(err){console.log('Error:'+err);
                                        console.log(res);}});

                } catch (error) {
                    console.log('ERRor'+error);
                }
            }
            else {
                console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
            }
        },
        async reportTransaction(contractAddress,abi,timeStamp){
            console.log('Report contract');
            console.log(contractAddress);
            console.log(abi);
            if (window.ethereum) {
                window.web3 = new Web3(ethereum);
                try {
                    // Request account access if needed
                    await ethereum.enable();
                    // Acccounts now exposed
                    console.log(web3.eth.defaultAccount)
                    var contract = web3.eth.contract(abi).at(contractAddress); 
                    contract.reportContract(timeStamp,{ from: web3.eth.defaultAccount, gas: 45000 },
                        (err, res) => { if(err){console.log('Error:'+err);
                                        console.log(res);}});

                } catch (error) {
                    console.log('ERRor'+error);
                }
            }
            else {
                console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
            }
        },
        async completeTransaction(contractAddress,abi){
            console.log('Complete contract');
            console.log(contractAddress);
            console.log(abi);
            if (window.ethereum) {
                window.web3 = new Web3(ethereum);
                try {
                    // Request account access if needed
                    await ethereum.enable();
                    // Acccounts now exposed
                    console.log(web3.eth.defaultAccount)
                    var contract = web3.eth.contract(abi).at(contractAddress); 
                    contract.complete({ from: web3.eth.defaultAccount, gas: 45000 },
                        (err, res) => { if(err){console.log('Error:'+err);
                                        console.log(res);}});

                } catch (error) {
                    console.log('ERRor'+error);
                }
            }
            else {
                console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
            }
        }
    },
});