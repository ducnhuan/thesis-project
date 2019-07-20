var formControl = new Vue({
    el: "#vue-form",
    data: {
        categories: [],
        partarea:['Engine','Tire & Wheel','Brake','Drivetrain']
    },
    components: {
    },
    created(){
        this.loadCategory();
    },
    methods:{
        loadCategory: function(){
            this.$http.get('/service/api/category/getDetail').then(response => {
                response.body.data.forEach(element => {
                    this.categories.push(element);
                });
                console.log(this.categories);
            }, response => {
                // error callback
                console.log('failed');
            })
        },
        addtotext: function(){
            var categoryText = document.getElementById('categoryText');
            var boxValue = document.getElementById('addCategory');
            var tmp  = this.categories[boxValue.selectedIndex]._id;
            categoryText.value = tmp;
        }
    }
});