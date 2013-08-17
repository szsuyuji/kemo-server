var Post = require('../model/post/post.js');
var Category = require('../model/post/category.js');
var Comment = require('../model/comment/comment.js');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('layout.html');
};


/**文章**/
/*
 * GET all posts,support Pagination
 */
exports.getPosts = function(req,res){

    new Post().findPagination({},function(){
        res.json({
            post:{a:1}
        });
    });

};

/*
 * GET a post
 */
exports.getPost = function(req,res){
  var postId = req.params.id;
  new Post().findOne(postId,function(err,post){
    //console.log(post);
   if(err){
       res.json({
           err: err
       });
   }else{
   res.json({
      post: post
    });  
   }
   });

};

exports.getPostPagination = function(req,res){
    var page = req.params.page;
    new Post().findPagination({page:page},function(err,records){
        if(err){
            res.json({
               err:err
            });
        } else{
            res.json({
                posts:records.docs
            });
        }
    });
}


/*
 * POST a post
 */
exports.addPost = function(req,res){
  var post = req.body['post'];
  var title = req.body['title'];
  var category = req.body['category'];
  var p = new Post(title,"suyuji",post,category);
  p.save(function(err,post){
  if(err){
     res.json({
         err:err
     });
  }else{
     res.send(post["_id"]);
  }
  });
 
};
/**分类**/
exports.getCategories = function(req,res){
      new  Category().find(function(err,categories){
          if(err){

          } else{
              res.json({
                  categories:categories
              });
          }
      });

}

/**评论**/
exports.getComments = function(req,res){
    var page = req.params.page;
    var postId = req.params.id;
    var comment = new Comment();
    comment.findPagination(postId,page,function(err,docs){
        if(err){
            res.json({
                err:err
            })
        }else{
            res.json({
                comments:docs
            });
        }
    });
}

exports.addComment = function(req,res){
   console.log(req.body);
   var postId = req.body["postId"];
   var content = req.body["content"];
   var at = req.body["at"];
   var user = req.body["user"];
   var ip = "127.0.0.1";
   var comment =  new Comment(postId,content,at,user,ip);
   comment.save(function(err,doc){
       if(err){
           res.json({
               err:err
           })
       }else{
           res.json({
              comment:doc
           });
       }
    });
}

/**用户**/
exports.login = function(req, res){
  res.render('login',{title:'用户登入'});
};