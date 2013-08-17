/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-8-10
 * Time: 上午11:40
 * To change this template use File | Settings | File Templates.
 */
var mongodb = require('../db/db.js');
function Category(name){
    this.name = name;
};
//创建schema，同时指定collection，否则都自动采用复数形式
var categorySchema =mongodb.mongoose.Schema({
    name:String
},{collection:"category"});
//注册model
mongodb.db.model("category",categorySchema);
module.exports = Category;


Category.prototype.find = function find(callback){
       //获取model
        var CategoryModel =mongodb.mongoose.model("category");
        //find是静态方法，不是实例方法
        CategoryModel.find(function(err,categories){
            callback(err,categories);
        });
};