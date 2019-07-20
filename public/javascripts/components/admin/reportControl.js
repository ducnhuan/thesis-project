var d = new Date();
var year = d.getFullYear();
var month=d.getMonth()+1;
class input {
    constructor(title,author){
        this.title = title;
        this.author = author;
    }
}
var reportCotrol=new Vue({
    el:'#vue-adminreport',
    data(){
        return{
         report:[],
         thisYear:0,
         thisMonth:0,
         title:[],
         author:[],
         parseData: {
            rid: '',
            pid:''
        }
        }
    },
    created(){
        this.loadReport();
    },
    methods:{
        loadReport: function(){
            console.log('1')
            this.thisMonth=0;
            this.thisYear=0;
            this.report.length=0;
            this.$http.get('/service/api/report/getAllDetail').then(response => {
                response.body.data.forEach(element => {
                   this.report.push(element);
                  // this.loadTitle(element.post)
                });
                console.log(this.report);
                this.countReport();
            }, response => {
                // error callback
                console.log(response.body);
            })
        },
        countReport: function(){
            this.report.forEach(element=>{
                var str=element.createdAt;
                if(str.slice(0,4)==year){this.thisYear+=1;}
                if(str.slice(0,4)==year&&str.slice(5,7)==month){this.thisMonth+=1;}
            })
           
        },
        deleteReport:function(reportId, postId){
            console.log(reportId, postId)
            this.$http.post('/service/api/report/deleteReport', {postId:postId,reportId:reportId})
             .then ((res)=> {if(res.body.status=="successful")
             {alert("Report are deleted.")}
              this.loadReport();                                                    
            })
             .catch ((error)=> console.log(error))
        },
        deletePost:function(reportId, postId){
            console.log("report id, post id",reportId, postId)
            this.$http.get('/service/api/post/getPost/'+postId).then(response => {
                console.log(response)
                forumlist=response.body.data.forumList;
                
                 this.$http.post('/service/api/post/deletePost', {postId:postId,forumId:forumlist})
                 .then ((res)=> {if(res.body.status=="successful")
                 {alert("Post are deleted.")}
                  this.deleteReport(reportId,postId);
                                                                
                 })
                 .catch ((error)=> console.log(error))     
                }, response => {
                // error callback
                console.log("Fail to load post");
                 })
        },
        updateData:function(reportId, postId){
            this.parseData.rid=reportId;
            this.parseData.pid=postId;
        },
        deleteAllReport:function(){
            console.log("delete all!!!!")
            this.$http.get('/service/api/report/deleteAllReport').then(response => {
                if(response.body.status=="successful")
                {alert("All report are deleted.")}
                this.loadReport();
            }, response => {
                // error callback
                console.log(response.body);
            })
        }
    }
})