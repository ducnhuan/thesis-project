var formControl = new Vue({
    el: "#vue-form",
    data: {
        categories: [],
        post:[],
        table:[],
        type:[],
        manufacture:[],
        model:[],
        year:[],
        categoryid:'',
        addType: '',
        search:'',
        result:[],
        partarea:['Engine','Tire & Wheel','Brake','Drivetrain'],
        addManufacture:'',
        addPart:'',
        addModel:'',
        addYear:'',
    },
    components: {
    },
    computed:{
        filteredTable() {
            console.log("run filter")
            return this.table.filter(element => {
              return element.title.toLowerCase().includes(this.search.toLowerCase())
            })
          }
    },
    watch:{
        addType: function(news,old){
            this.manufacture.length=0;
            this.model.length=0;
            this.year.length=0;
            this.table=[];
            this.addPart='';
            this.categories.forEach(element=>{
                if(element.transportType==news)
                {
                    if(this.manufacture.length==0)
                    {
                        this.manufacture.push(element.transportManufacture);
                    }
                    else
                    {   var result=true;
                        for(var i=0; i<this.manufacture.length;i++)
                        {
                            if(element.transportManufacture==this.manufacture[i])
                                {result=false;
                                break;}
                        }
                        if(result==true)
                        {this.manufacture.push(element.transportManufacture);}
                    }
                    
                }
            })
        },
        addManufacture:function(news, old)
        {  this.model.length=0;
           this.year.length=0;
           this.table=[];
           this.addPart='';
           this.categories.forEach(element=>{
               if(element.transportManufacture==news && element.transportType==this.addType)
               {
                if(this.model.length==0)
                    {
                        this.model.push(element.transportModel);
                    }
                    else
                    {   var result=true;
                        for(var i=0; i<this.model.length;i++)
                        {
                            if(element.transportModel==this.model[i])
                                {result=false;
                                break;}
                        }
                        if(result==true)
                        {this.model.push(element.transportModel);}
                    }
               }
           })
        },
        addModel:function(news, old)
        {  this.year.length=0;
            this.table=[];
            this.addPart='';
           this.categories.forEach(element=>
            {
               if(element.transportManufacture==this.addManufacture && element.transportType==this.addType&& element.transportModel==news)
               {    
                
                if(this.year.length==0)
                    {
                        this.year.push(element.transportYear);
                    }
                    else
                    {   var result=true;
                        for(var i=0; i<this.year.length;i++)
                        {
                            if(element.transportYear==this.year[i])
                                {result=false;
                                break;}
                        }
                        if(result==true)
                        {this.year.push(element.transportYear);}
                    }
               }
           })
        },
        addYear:function(news,old){
            this.table=[];
            this.addPart='';
        },
        addPart:function(news, old){
            if(news!=""){
            this.table.length=0;
            console.log(this.table.length)
            this.categories.forEach(element=>{
                if(element.transportManufacture==this.addManufacture && element.transportType==this.addType&& element.transportModel==this.addModel
                     &&element.transportYear==this.addYear){
                       //console.log("true",element._id);  
                       this.categoryid=element._id;}})
            if(this.categoryid!=''){
            console.log("run get post")
            this.$http.get('/service/api/post/searchPost/'+this.categoryid+'/'+news).then(
                response=>{
                    console.log("response body",response.body);
                    console.log("respone length",response.body.data.length==0);
                    if(response.body.data.length==0){
                        this.table=[];
                        alert("Sorry. We not found post about this problem.!!");}
                    else{
                    
                    response.body.data.forEach(element=>{
                        console.log(element!="")
                        this.table.push(element);
                        console.log("success!!")
                       
                    })}
                }
                ,response=>{
                    console.log("failure!!")
                });}}



        }


    },
    created(){
        this.loadCategory();
    },
    methods:{
        loadCategory: function(){
            this.$http.get('/service/api/category/getDetail').then(response => {
                response.body.data.forEach(element => {
                    this.categories.push(element);
                });
                console.log(this.categories);
                this.getType();
            }, response => {
                // error callback
                console.log('failed');
            })
           // this.loadPost();
        },
        loadPost:function(){
            this.$http.get('/service/api/post/getAllDetail').then(response => {
                response.body.data.forEach(element=>{
                    this.post.push(element);
                });
                console.log(this.post);
            },  response =>{
                console.log('failed');
            }
        )},
        addtotext: function(){
            var categoryText = document.getElementById('categoryText');
            var boxValue = document.getElementById('addCategory');
            var tmp  = this.categories[boxValue.selectedIndex];
            categoryText.value += tmp + ';';
        },
        getType: function(){
          this.categories.forEach(element=>
            { // console.log(element.transportType);
                //console.log(this.type.length);
                if(this.type.length==0){this.type.push(element.transportType);}
                else
                {   var result=true;
                    for(var i=0; i<this.type.length;i++)
                    {
                        if(this.type[i]==element.transportType)
                        {
                            result=false;
                            break;   
                        }
                    }
                    if(result==true){
                    this.type.push(element.transportType)}
                }
              //{   console.log(this.type[i]==element.transportType);
                //  if(this.type[i]==element.transportType){continue;}
                  //else{this.type.push(element.transportType);
                    //    }
             // }

          })
          
        }
    }
});
