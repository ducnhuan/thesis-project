var formContro2 = new Vue({
    el: "#vue-signin",
    data: {
        email:'',
        password:'',
    },
    methods:{
        submitsignin:function(){
            //console.log(this.email, this.password)
            this.$http.post('/auth/login',{ email: this.email, pwd:this.password})
            .then(function(res){
                //Success
              if(res.data.rule=="admin"){
                window.location.href='/admin'}
                else{
                window.location.href='/home'
                }
            })
            .catch(function(res){
                //Error
               // console.log(res)
                 alert('Wrong email or password. Please try again or reset password!!!');
            })
        }
    }
});
