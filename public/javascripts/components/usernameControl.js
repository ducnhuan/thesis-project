var formControl = new Vue({
    el: "#vue-form1",
    data: {
        username:'',
    },
    methods:{
        submitgoogle:function(){
            this.$http.post('/googleUser',{ usr: this.username}).then(response=>{
                window.location.href='/home'},
                response=>{
                    alert(response.body);})
        },
        submitfacebook:function(){
            this.$http.post('/facebookUser',{ usr: this.username}).then(response=>{
                window.location.href='/home'},
                response=>{
                    alert(response.body);})
        }
    }
});
