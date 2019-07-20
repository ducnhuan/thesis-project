class user {
    constructor(id,name,role){
        this.id = id;
        this.usrName = name;
        this.role = role;
    }
}
new Vue({
    el:'#vue-dashboard',
    data(){
        return{
            admin: 0,
            user:0,
            parseData: {
                uid: ''
            },
            datas: []
        }
    },
    created(){
        this.loadUser();
    },
    methods:{
        loadUser: function(){
            this.reset();
            this.$http.get('/service/api/user/getAllDetail/').then(response => {
                response.body.data.forEach(element => {
                    var input = new user(element._id,element.username,element.userType);
                    this.datas.push(input);
                    if (input.role =='admin'){
                        this.admin +=1;
                    }else{
                        this.user +=1;
                    }
                });
               
            }, response => {
                // error callback
                console.log(response.body);
            })
        },
        promoteUser: function(usrID){
            console.log(usrID);
            this.$http.put('/service/api/user/updateRole/'+usrID,{role:'admin'}).then(response => {
                //success
                console.log(response.body);
            }, response => {
                // error callback
                console.log('fail');
            })   
        },
        deleteUser: function(usrID){
            this.$http.delete('/service/api/user/'+usrID).then(response => {
                //success
                console.log(response.body);
            }, response => {
                // error callback
                console.log('fail');
            })   
        },
        updateParse: function(usrID){
            this.parseData.uid = usrID;
        },
        reset: function(){
            this.datas = [];
            this.admin = 0;
            this.user = 0;
        }
    }
})