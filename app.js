/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    fs = require('fs'),
    MongoStore = require('connect-mongo')(express),
    settings = require('./db_config'),
    engines = require('consolidate'),
    path = require('path');


var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};

// 定义共享环境
app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.engine('html', engines.swig);
    app.set("view engine", 'html');
    app.use(allowCrossDomain);
    app.use(express.favicon());
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(app.router);

});

// 定义开发环境
app.configure('development', function(){
    app.use(express.logger('dev'));
    app.use(express.static(path.join(__dirname, 'client')));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    //session support
    app.use(express.session({
        secret:settings.cookieSecret,
        store:new MongoStore({
            db:'kemo',
            host:'localhost'
        })
    }));
});

// 定义生产环境
app.configure('production', function(){
    //session support
    app.use(express.session({
        secret:settings.cookieSecret,
        //可以在appfog里指定环境变量
        store:new MongoStore({
            db:settings.db,
            host:settings.host,
            port:10099,
            username:'appfog',
            password:'appfog'
        })
    }));
    //app.use(express.static(path.join(__dirname, 'client')));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

//初始化router
var router =JSON.parse(fs.readFileSync("./router.json","UTF-8"));
for(var key in router){
    var r = router[key];
    if(r[0]==="GET"){
        app.get(r[1],routes[key]);
    }else if(r[0]==="POST"){
        app.post(r[1],routes[key]);
    }else if(r[0]==="DELETE"){
        app.delete(r[1],routes[key]);
    }else if(r[0]==="PUT"){
        app.put(r[1],routes[key]);
    }
}
 //404 处理
app.use(function(req, res, next){
    res.status(404);
    res.json({error: 'Not found' });
});
//5xx err 处理,err handler 这里有4个参数
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    var errMsg = process.env.NODE_ENV=="production"?"sorry,a error was occured!":err.toString();
    res.json({error:errMsg });
});

//开启server
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});