var mongodb = require('../db/db.js');
function Post(title,user,content,category){
	this.title = title;
    this.browsed = 0;
	this.user = user;
	this.content = content;
	this.time =  new Date();
    this.category = category;
   
};

module.exports = Post;

var postSchema = mongodb.mongoose.Schema({
    title:String,
    user:String,
    content:String,
    browsed:Number,
    time: Date,
    category:String
},{collection:"post"});
mongodb.db.model('post', postSchema);
/*
 *保存
 */
Post.prototype.save = function save(callback){
 var PostModel= mongodb.mongoose.model("post");
 var post = new  PostModel({
           title:this.title,
           user:this.user,
           content:this.content,
           browsed:this.browsed,
           time:this.time ,
           category:this.category
       }) ;
    post.save(function(err,post){
            callback(err,post);
    });
};

Post.prototype.findOne= function findOne(id,callback){
     var PostModel= mongodb.mongoose.model("post");
     PostModel.findByIdAndUpdate(id,{$inc:{browsed:1}},{new:true},function(err,doc){
        callback(err,doc);
    });
};

Post.prototype.findPagination = function(opts,callback){
    var limit = opts.limit|| 6;
    var page  = opts.page|| 1;
    var PostModel= mongodb.mongoose.model("post");
    PostModel.paginate({page:page,limit:limit,sort:{browsed:-1}},function(err,records){
        callback(err,records);
    });
}



