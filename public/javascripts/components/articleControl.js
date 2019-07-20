import {getCookie} from '../getCookie.mjs'
var postID = document.URL.split('id=')[1];
var userName = getCookie("usrName");

// article content
var article = new Vue({
    el: '#vue-content',
    data(){
        return{
            info: {
                title: "loading..",
                content: "still loading...",
                author:''
            },
            email:'',
            seen:false,
            reason:[]
        }
    },
    created(){
        this.loadContent()
    },
    methods:{
        reportreason:function(){
            this.reason.length=0;
            this.seen=!this.seen;
        },
        loadContent: function(){
            this.$http.get('/service/api/post/getpost/'+postID)
            .then(response => {
                var element = response.body.data;
                var input = {
                    title: element.title,
                    content: element.description,
                    author:element.user
                }
                this.info= input;
                document.title += " "+ input.title;
                console.log(this.info.content);
                this.info.content=this.info.content.replace("&lt;","<");
                this.info.content=this.info.content.replace("&gt;",">");
            }, response => {
                // error callback
                console.log('failed');
            })
        } ,
        forwardingthread:function(){
            //console.log(document.URL);
            //console.log("email:", this.email);
            //console.log(getCookie("usrName"));
            this.$http.post('/forwardthread', {link:document.URL, email:this.email,username:getCookie("usrName")})
            .then ((res)=> console.log (res.body))
            .catch ((error)=> console.log(error))
        },
        createReport:function(){
            console.log("PostID:",postID);
            console.log("Reason:", this.reason);
            console.log("Reporter:",getCookie("token"));
            console.log("Title",this.info.title)
            this.$http.post('/service/api/report/createReport', {postId:postID,reason:this.reason.toString(),reporter:getCookie("token"),title:this.info.title})
             .then ((res)=> {if(res.body.status=="successful"){alert("Report are saved. Thank for your attribute.")}})
             .catch ((error)=> console.log(error))
        }
    }
});

//comment section
var comment = new Vue({
    el:'#vue-comment',
    data() {
        return {
            commentBox:'',
            comments:[],
            replyBox:'',
            replies:[],
            channel: {}
        }
    },
    created(){
            this.loadComment()
    },
    methods:{
        loadComment: function(){
            this.$http.get('/service/api/comment/getDetail/'+postID).then(response => {
                try {
                    response.body.data.forEach(element=>{
                        var tmp = element.content.split(':::');
                        var input = {
                            cmtID: element._id,
                            user: tmp[0],
                            content: tmp[1],
                            avatar: tmp[2],
                            vote: tmp[3],
                            time: element.content.createdAt,
                            reply: element.subComment
                        }
                        for (var i=0; i<input.reply.length; i++){
                            var subtmp = input.reply[i].content.split(':::');
                            input.reply[i].username = subtmp[0];
                            input.reply[i].content = subtmp[1];
                            input.reply[i].avatar = subtmp[2];
                            input.reply[i].vote = subtmp[3];
                        }
                        this.comments.push(input);
                    });
                    // console.log(response.body.data);
                    // this.toggleReply();
                    console.log(this.comments);
                }
                catch(err){
                    console.log('empty');
                }
                this.pusher()
            }, response => {
                // error callback
                console.log('failed');
            })
        },

        addComment: function(){
            var input = {
                user: userName,
                content:  this.commentBox
            };

            if(input.content != '' ){
                //this.comments.push(input);
                var dataSent ={
                    post: postID,
                    //user: userName,
                    token: getCookie('token'),
                    content: getCookie("usrName")+":::"+this.commentBox+":::"+getCookie("avatar")+":::"+'0'
                }
                //get api
                this.$http.post('/service/api/comment/createComment', { data: dataSent})
                .then(response => {
                   //Success
                   //console.log(response);
                }, response => {
                    // error callback
                    console.log('failed');
                })
            }


            this.commentBox = '';
        },

        addReply: function(cid,index){
            var input ={
                post: postID,
                token: getCookie('token'),
                comment: cid,
                content: userName+":::"+this.replyBox+":::"+getCookie("avatar")+":::"+'0',
                commentIndex : index
            }
            // console.log(input.comment);
            this.replyBox ='';
            this.$http.post('/service/api/comment/createSubComment', {data: input})
            .then(response => {
               //Success
               console.log(response);
            }, response => {
                // error callback
                console.log(response);
                // console.log('failed');
            })
            this.replyBox ='';
        },

        toggleReply: function(){
            var comment = document.getElementsByClassName('comment');
            for (var i = 0; i<comment.length;i++){
                var current = comment[i];
                current.addEventListener("mouseout",function(){
                    var widget = this.children[2];
                    widget.style.display = "none";
                });

                current.addEventListener("mouseover",function(){
                    var widget = this.children[2];
                    widget.style.display = "block";
                });
            }
        },
        pusher: function(){
            // Realtime comment function
            Pusher.logToConsole = true;

            var pusher = new Pusher('e0d50cdec56f3482d272', {
                cluster: 'ap1',
                forceTLS: true
            });

            var channel = pusher.subscribe('motor-forum');

            channel.bind('add-comment', function(data) {
                var tmp = data.content.split(':::');
                var input = {
                    cmtID: data.id,
                    user: tmp[0],
                    content: tmp[1],
                    avatar: tmp[2],
                    vote: tmp[3],
                    reply: []
                }
                comment.comments.push(input);
            });

            channel.bind('add-subcomment', function(data) {
                console.log('ok');
                var tmp = data.content.split(':::');
                var input = {
                    _id: data.id,
                    username: tmp[0],
                    content: tmp[1],
                    avatar: tmp[2],
                    vote: tmp[3]
                }
                comment.comments[data.index].reply.push(input);
            });
        }
    },
    mounted(){
        this.toggleReply()
    },
    updated(){
        this.toggleReply()   
    }
})
