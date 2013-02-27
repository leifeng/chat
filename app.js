var express = require('express')
    , app = express()
//,RedisStore = require('connect-redis')(express)
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server)
    , connect = require('connect')
    , cookie = require('cookie')
    , MemoryStore = connect.middleware.session.MemoryStore
    , redis = require("./routers/RedisHelp");


var storeMemory = new MemoryStore({
    reapInterval:60000 * 10
});
//var options = {
//    hostname: "127.0.0.1",
//    port: 6379
//}
//app.configure(function () {
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.bodyParser());
app.use(express.cookieParser("zcl"));
//app.use(express.session({ store:new RedisStore(options)}));
app.use(express.session({ store:storeMemory}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express['static'](__dirname + '/public'));
app.use(express.favicon(__dirname + '/public/img/favicon.ico'), {
    maxAge:2592000000
});
//});

require("./router")(app);


io.configure(function () {
    io.set('transports', ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
//    io.set('transports', ['websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
    io.set('authorization', function (handshakeData, callback) {
        if (!handshakeData.headers.cookie) {
            return callback('no found cookie', false);
        }
        handshakeData.cookie = connect.utils.parseSignedCookies(cookie.parse(decodeURIComponent(handshakeData.headers.cookie)), "zcl");
//        console.log("handshakeData:" + handshakeData.headers.cookie + "&&&&&&&" + handshakeData.cookie);
        var connect_sid = handshakeData.cookie['connect.sid'];
        console.log("connect_sid:" + connect_sid);
        if (connect_sid) {
            storeMemory.get(connect_sid, function (error, session) {
                if (error) {
                    callback(error.message, false);
//                    console.log("session:" + session);
                }
                else {
                    handshakeData.session = session;
//                     console.log("handshakeData.session:" + handshakeData.session);
                    callback(null, true);
                }
            });
        }
        else {
            callback('nosession');
        }
    });
});
var UserSocket = {};
io.sockets.on("connection", function (socket) {
    var session = socket.handshake.session;
    var name = session.user;
    var uid = session.uid;
    UserSocket[name] = socket;


    redis.AddOnlineList(name, function () {
        redis.RefreshOnlineList(function (result) {
            redis.chatRecord(function(redult){
               var record=UserSocket[name];
                record.emit("record",{msg:redult});
                io.sockets.emit("system message", { msg:name + "上线了", online:result});
            });
        });
    });




    socket.on("public message", function (data) {
        redis.ifStop(uid, function (result) {
            if (result) {
                var t = new Date();
                var times= t.getFullYear()+'-'+ t.getMonth()+'-'+t.getDay()+' '+ t.getHours()+':'+t.getMinutes()+':'+ t.getSeconds()
                console.log(times);
                var content=data.msg.toString().replace('|','，').replace(',','，')+'|'+name+'|'+times;
                redis.saveRecord(content);
                console.log(content);
                socket.broadcast.emit("public message", {msg:data.msg, user:name});
            }
            else {
                var err = UserSocket[name];
                err.emit("err", {msg:'你已被管理员禁言'});
            }
        });

    });

    socket.on("private message", function (data) {

        var err = UserSocket[name];
        redis.ifStop(uid, function (result) {
            if (result) {
                var to = data.to;
                console.log(to);
               // for (var i in to) {
                    var toUser = UserSocket[to];
                    if (to == name) {
                        err.emit("err", {msg:'不能对自己私聊'});
                    } else {
                        if (toUser) {
                            toUser.emit("private message", {msg:data.msg, user:name, to:to});
                        }
                        else {
                            err.emit("err", {msg:'没有此用户'});
                        }
                    }
                //}
            }
            else {
                err.emit("err", {msg:'你已被管理员禁言'});
            }
        });


    });


    socket.on("disconnect", function () {
        redis.PullOnlineList(name, function () {
            redis.RefreshOnlineList(function (result) {
                delete UserSocket[name];
                socket.broadcast.emit("system message", { msg:name + "离开了", online:result });
            });
        });
    });
});

//server.listen(process.env.VCAP_APP_PORT || 3000);
server.listen(process.env.PORT || 3000);

