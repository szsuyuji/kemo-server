var setting = require('../../db_config');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOHQ_URL||"mongodb://kemo:kemo@localhost:27017/kemo");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    // yay!
});
//分页查询
mongoose.Model.paginate = function(opts, callback) {
    var limit = opts.limit || 10;
    var page = opts.page || 1;
    var query = opts.query||{};
    var sort = opts.sort||{};
    var fields = opts.fields||null;
    var Model = this;
    //总数
    Model.count(function (err, totalRecords) {
        Model.find(query,fields,{sort:sort,limit:limit,skip:(page - 1) * limit},function(err,docs) {
            if (err) return callback(err);
            var  records = {docs:docs,totalRecords:totalRecords,currentPage:page,totalPages:Math.ceil(totalRecords / limit)};
            callback(null, records);
        });
    });
}
module.exports = {'mongoose':mongoose,'db':db}