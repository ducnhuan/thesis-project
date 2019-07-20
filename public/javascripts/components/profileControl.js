import {getCookie} from '../getCookie.mjs';

var usrToken = getCookie('token');
Vue.component('modal', {
    template: '#modal-template'
}) 

var formControl = new Vue({
    el: "#vue-profile",
    data: {
        usr : {},
        status: "Upload Image to change avatar",
        fileUpload: '',
        file: []
    },
    created(){
        this.loadInfo();
    },
    methods:{
        loadInfo: function(){
            //get user detail
            this.$http.get('/service/api/user/getDetail/'+usrToken).then(response => {
                this.usr = response.body.data;
                // console.log(this.usr);
                this.usr.token = getCookie('token');
            }, response => {
                // error callback
                console.log('failed');
            })
        },
        previewFile: function(){
            this.status = "Loading ..."
            var inputFile = this.$refs.imgFile.files;
            if (inputFile.length){
                // Reject big files
                if (inputFile[0].size > this.$refs.imgFile.dataset.maxSize * 1024) {
                    console.log("Please select a smaller file");
                    return false;
                }

                // Begin file upload
                this.status= "Uploading file to Imgur..";

                // Replace ctrlq with your own API key
                var apiUrl = 'https://api.imgur.com/3/image';
                var apiKey = 'ctrlq';

                var settings = {
                async: false,
                crossDomain: true,
                processData: false,
                contentType: false,
                type: 'POST',
                url: apiUrl,
                headers: {
                    Authorization: 'Client-ID ' + apiKey,
                    Accept: 'application/json'
                },
                mimeType: 'multipart/form-data'
                };

                var formData = new FormData();
                formData.append("image", inputFile[0]);
                settings.data = formData;

                // Response contains stringified JSON
                // Image URL available at response.data.link
                $.ajax(settings).done(function(response) {
                    console.log(response);
                    // this.fileUpload= response;
                });
                this.status = "Finish";
            }
        }
    }
});

var postControl = new Vue({
    el: "#vue-profile-post",
    data: {
        posts: [],
        showModal: false,
        parseData : {}
    },
    component :{

    },
    created(){
        this.loadPost();
    },
    methods:{
        loadPost: function(){
            // get post detail
            this.$http.get('/service/api/post/getUserPost/'+usrToken).then(response => {
                try {
                    response.body.data.forEach(element => {
                        this.posts.push(element);
                    });
                }catch(err){
                    this.posts = [];
                }
                
            }, response => {
                // error callback
                console.log('failed');
            })
        },
        deletePost: function(postID,forumID){
            // console.log('click');
            this.$http.post('/service/api/post/deletePost',{postId: postID, forumId: forumID}).then(response => {
                console.log('success');
            }, response => {
                // error callback
                console.log('failed');
            })
        },
        deleteReminder: function(postID,forumID){
            this.parseData.pid = postID;
            this.parseData.fid= forumID;
        }
    }

})
