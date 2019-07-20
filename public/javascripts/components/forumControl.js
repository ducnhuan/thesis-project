class forum {
    constructor(id, name,last,thread,post) {
        this.id = id;
        this.forumName = title;
        this.Postdate = date;
        this.comment = comment;
        this.lastComment = lc;
    }
}

var table = new Vue({
    el: '#vue-forum',
    data: {
        searchbar:'',
        filterType:'name',
        tableData:[]
    },
    created(){
        this.loadtableData()
    },
    methods:{
        loadtableData: function(){
            this.$http.get('/service/api/forumList/getDetail').then(response => {
                // console.log(response.body.data)
                response.body.data.forEach(element => {
                    console.log(element);
                    var input = {
                        id: element._id,
                        forumName: element.forumName,
                        lastPost: element.recentPost,
                        thread: element.numOfPost,
                        post: element.numOfComment
                    }
                    this.tableData.push(input);
                });

                console.log('table data:',this.tableData);
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
                  return row.forumName.toLowerCase().includes(this.searchbar.toLowerCase())
              }else{
                return row.lastPost.toLowerCase().includes(this.searchbar.toLowerCase())
              }
            })
        }
    }
});