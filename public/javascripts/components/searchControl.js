var formControl = new Vue({
    el: "#vue-search",
    data: {
        Id:''
    },
    watch:{},
    methods:{
        subtmitId:function()
        {
            console.log(this.Id);
            this.$http.get('/service/api/order/getDetail/'+this.Id)
            .then(response=>
                {
                    console.log('1');
                    console.log(response);
                },response=>{
                    console.log('2');
                    console.log(response.body);
                })


        }
    }
});
