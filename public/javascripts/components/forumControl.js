var table = new Vue({
    el: '#vue-forum',
    data: {
        searchbar:'',
        filterType:'name',
        tableData:[]
    },
    created(){
        this.loadtableData()
    },
    methods:{
        loadtableData: function(){
            console.log('Hello');
            var id = {"id":['8012v000001PcWVAA0','8012v000001PdSrAAK']};
            //this.$http.get('/test',id)
            //.then(response=>{console.log(response);},response=>{console.log(response);})

        }
    },
});