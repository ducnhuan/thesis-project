var postID = document.URL.split('id=')[1];
var formControl = new Vue({
    el: "#vue-search",
    data: {
        Id:'',
        progress:0,
        orderData:[],
        state:["Draft","Confirm","Activated","Delivering","End"]
    },
    watch:{},
    created(){
        this.searchOrder();   
    },
    methods:{
        searchOrder:function()
        {
            console.log(postID);
             this.$http.get('/service/api/order/getDetail/'+postID)
             .then(response=>
                 {
                     var result=response.body.data;
                     var input = {
                        Id: result.Id,
                        Status: result.Status,
                        EffectiveDate:result.EffectiveDate,
                        Total: result.TotalAmount,
                        OrderItems:result.OrderItems
                    };
                    this.orderData.push(input);
                    //console.log(result.Status);
                    this.progress=20+this.state.indexOf(result.Status)*20;
                 },response=>{
                     console.log('2');
                     var patt= new RegExp("System.QueryException: List has no rows for assignment to SObject");
                     if(response.body.err.errorCode=="INVALID_SESSION_ID")
                     {
                        setTimeout(function(){this.searchOrder()}.bind(this),3000);
                     }
                     else if(patt.test(response.body.message)){alert("The Order Id is non existing. Please try again or contact support.")}
                     else{alert('Error occured please contact admin for technical support.')}
                 })


        }
    }
});
