class category {
    constructor(id,brand,model,year){
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.year = year;
    }
}
new Vue({
    el:'#vue-dashboard',
    data(){
        return{
            brand: [],
            parseData: {
                cid: ''
            },
            datas: []
        }
    },
    created(){
        this.loadCategory();
    },
    methods:{
        loadCategory: function(){
            this.reset();
            this.$http.get('/service/api/category/getDetail/').then(response => {
                response.body.data.forEach(element => {
                    var input = new category(element._id,element.transportManufacture,element.transportModel,element.transportYear);
                    this.datas.push(input);
                    if (this.brand.indexOf(input.brand) == -1){
                        this.brand.push(input.brand);
                    }
                });
               
            }, response => {
                // error callback
                console.log(response.body);
            })
        },
        deleteCategory: function(cid){
            console.log(cid);
            this.$http.delete('/service/api/category/'+cid).then(response => {
                //success
                console.log(response.body);
            }, response => {
                // error callback
                console.log('fail');
            })  
        },
        updateParse: function(cID){
            this.parseData.cid = cID;
        },
        reset:function(){
            this.brand = [];
            this.datas = [];
        }
    }
})