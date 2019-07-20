var formContro2 = new Vue({
    el: "#vue-form2",
    data: {
        lname:'',
        fname:'',
        email:'',
        password:'',
    },
    methods:{
        validate:function()
        {
            if(this.lname && this.fname && this.email && this.password)
            {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if(re.test(String(this.email).toLowerCase()))
                {
                    this.submitsignup();
                }
                else
                {
                    console.log('false');
                }
            }
            else
            {
                console.log('Not full fill');
            }
        },
        submitsignup:function(){
            this.$http.post('/auth/register',{ lname: this.lname,fname:this.fname, pwd:this.password, email:this.email})
            .then(function(res){
                //Success
                window.location.href='/signin'

            })
            .catch(function(res){
                //Error
                alert(res.body);
            })
        }
    }
});
