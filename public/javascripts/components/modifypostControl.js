import {urlParam} from '../urlParam.mjs'
import {getCookie} from '../getCookie.mjs'
var postID = urlParam('id');
var token = getCookie('token')

class post{
    constructor(a,b,c,d,e){
        this.ID=a;
        this.title=b;
        this.content=c;
        this.category=d;
        this.author=e;
    }
}

var area;
bkLib.onDomLoaded(function() {
    //addTextArea();
});

function addTextArea(){
    area = new nicEditor({fullPanel : true}).panelInstance('content');
}

var modify = new Vue({
    el:'#vue-modify-post',
    data:{
        post: new post('','','','',''),
        categories: []
    },
    created(){
        this.loadPost()
    },
    methods:{
        loadPost: function(){
            // load categories
            this.$http.get('/service/api/category/getDetail').then(response => {
                response.body.data.forEach(element => {
                    this.categories.push(element);
                });
                addTextArea();
            }, response => {
                // error callback
                console.log('failed');
            })

            // load post
            this.$http.get('/service/api/post/getpost/'+postID).then(response => {
                var element = response.body.data;
                console.log(element)
                var input = new post(postID,element.title,element.description,element.category,token);
                console.log(input)
                this.post= input;

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
        },
        modifySent: function(){
            var pack = $('form').serializeArray().reduce(function(obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
            pack.description = $('#vue-modify-post').find('.nicEdit-main').text();
            this.$http.put('/service/api/post/modifyPost/',{data: pack}).then(response => {
                console.log(response);
                window.location.href= '/forum';
            }, response => {
                // error callback
                console.log(response);
            })
        }
    }
})