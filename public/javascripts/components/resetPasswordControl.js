var table = new Vue({
    el: '#vue-reset',
    data: {
        newPass: '',
        confirmPass:'',
    },
    methods:{
        submitPassword:function()
        {
            var token = document.URL.split('token=')[1];
            if(this.newPass!=this.confirmPass)
            {alert('Confirm pass is not same as new pass. Please try again.');}
            else
            {
                this.$http.post('/auth/setPassword',{ token: token, pwd:this.newPass})
            .then(function(res){
                //Success
                window.location.href='/home'})
            .catch(function(res){
                //Error
               // console.log(res)
                 alert(res);
            })
            }
            console.log(token);
            console.log(this.newPass);
            console.log(this.confirmPass);
        }

    },
})

