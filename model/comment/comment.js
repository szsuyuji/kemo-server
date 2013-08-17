/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-8-11
 * Time: 下午2:14
 * To change this template use File | Settings | File Templates.
 */
var mongodb = require('../db/db.js');

 function Comment(postId,content,at,email,ip){
    this.postId = postId;
    this.content = content;
    this.time = new Date();
    this.user = email;
    this.ip = ip;
    this.at = at || "";
}
  //定义schema，必须明确定义包含哪些字段
var commentSchema = mongodb.mongoose.Schema({
    postId:mongodb.mongoose.Schema.Types.ObjectId,
    content:String,
    time:Date,
    user:String,
    at:String,
    ip:String
},{collection:"comment"});
//注册model
mongodb.db.model("comment",commentSchema);
module.exports = Comment;

 Comment.prototype.save = function(callback){
     var CommentModel = mongodb.mongoose.model("comment");
     var comment =new CommentModel({
         postId:this.postId,
         content:this.content,
         time:this.time,
         user:this.user,
         at:this.at,
         ip:this.ip
     });
     //save属于实例方法
     comment.save(function(err,doc){
         callback(err,doc);
     });
 }

Comment.prototype.findPagination = function(postId,page,callback){
    var max = 20;
    var CommentModel = mongodb.mongoose.model("comment");
    var comment = {
        postId:postId
    };
    //简单的分页查询，这是一种链式方式
    CommentModel.paginate({limit:15,page:page,query:comment,sort:{time:-1}},function(err,records){
        callback(err,records);
    });
}