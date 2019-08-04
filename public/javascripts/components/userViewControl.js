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
                    console.log(response);
                    response.body.data.forEach(result=>
                        {
                            console.log(result);
                            console.log(result.OrderItems.records[0].UnitPrice);
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
        }
    },
});