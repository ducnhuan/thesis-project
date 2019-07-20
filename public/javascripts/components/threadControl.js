import {urlParam} from '../urlParam.mjs'

var forumID = urlParam('id');
var forumName = urlParam('name');
document.title += ' ' + decodeURI(forumName);

class thread {
    constructor(id, title, date, comment,lc) {
        this.id = id;
        this.title = title;
        this.Postdate = date;
        this.comment = comment;
        if (lc){
            this.bad = "true";
        }else{
            this.bad = "false";   
        }
    }
}

var table = new Vue({
    el: '#vue-thread',
    data: {
        searchbar: '',
        filterType: 'name',
        id: forumID,
        info: {
            forumName: decodeURI(urlParam('name')),
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        tableData: []
    },
    created(){
        this.loadtableData()
        //this.loadforumInfo()
    },
    methods:{
        loadforumInfo: function(){
            this.$http.get('/service/api/forumList/getDetail',{params: {id : forumID}}).then(response => {
                response.body.data.forEach(element => {
                    var input = {
                        forumName: element.forumName,
                        description: element.description
                    }
                    this.info=input;
                });
            }, response => {
                // error callback
                console.log('failed');
            })
        },
        loadtableData: function(){
            this.$http.get('/service/api/post/getDetail/'+forumID).then(response => {
                response.body.data.forEach(element => {
                    console.log(element)
                    var input = new thread(element._id,
                        element.title,
                        element.createdAt,
                        element.numOfComment,
                        element.reported
                    )
                    this.tableData.push(input);
                });
                //console.log(this.tableData);
            }, response => {
                // error callback
                console.log('failed');
            })
        }
    },
    computed:{
        filteredtableData() {
            return this.tableData.filter(row => {
              if(this.filterType == 'name'){
                  return row.title.toLowerCase().includes(this.searchbar.toLowerCase())
              }else{
                return row.Postdate.toLowerCase().includes(this.searchbar.toLowerCase())
              }
            })
        }
    }
})

