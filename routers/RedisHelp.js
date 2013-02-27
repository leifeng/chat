var redis = require("redis");

//if (process.env.VCAP_SERVICES) {
//    var env = JSON.parse(process.env.VCAP_SERVICES);
//    var db = env["redis-2.2"][0]["credentials"];

//}

var db = {
    hostname:"192.168.1.60",
    //hostname:"50.30.35.9",
    port:6379

}


var client = redis.createClient(db.port, db.hostname);
//client.auth("da79ee719cc37e974923b65d888b7189");
var findkeys = function (callback) {
    client.keys("*", function (err, reply) {
        if (!err) callback(reply);
    })
}

var delkeys = function (callback) {
    findkeys(function (keys) {
        var key = keys.toString().split(',');
        for (var i = 0; i <= key.length; i++) {
            client.del(key[i], function () {
                callback();
            });
        }
    })
}

var regUser = function (user, pwd, callback) {
    client.get("user_" + user, function (err, reply) {
        if (reply == null) {
            client.get("userid", function (err, uid) {
                if (uid == null) {
                    client.set("userid", 1);
                    uid = 1;
                    client.LPUSH("user_id", uid);
                    client.set("user_name_" + uid, user);
                    client.set("user_pwd_" + uid, pwd);
                    client.set("user_" + user, uid);
                    client.set("user_static_" + uid, "1");//用户状态 是否禁言
                    callback(uid);
                } else {
                    client.incr("userid", function (err, uid) {
                        client.LPUSH("user_id", uid);
                        client.set("user_name_" + uid, user);
                        client.set("user_pwd_" + uid, pwd);
                        client.set("user_" + user, uid);
                        client.set("user_static_" + uid, "1");//用户状态 是否禁言
                        callback(uid);
                    });
                }

            });

        }
        else {
            callback(0);
        }
    });
}

var findUser = function (user, pwd, callback) {
    client.get("user_" + user, function (err, uid) {
        if (uid == null) {
            callback(0);
        }
        else {
            client.get("user_pwd_" + uid, function (err, upwd) {
                if (err) {
                    callback(0);
                } else {
                    if (upwd == pwd) {
                        callback(uid);
                    }
                    else {
                        callback(0);
                    }
                }
            });
        }
    });
}
//在线用户管理
var AddOnlineList = function (user, callback) {
    client.SADD("online", user, function (err, result) {
        if (!err)  callback();
    });
}

var PullOnlineList = function (user, callback) {
    client.SREM("online", user, function (err, result) {
        if (!err) callback();
    })
}

var RefreshOnlineList = function (callback) {
    client.SMEMBERS("online", function (err, result) {
        callback(result);
    })
}
//禁言
var stopUser = function (uid, callback) {
    client.set("user_static_" + uid, "0");
}
var ifStop = function (uid, callback) {
    client.get('user_static_' + uid, function (err, result) {
        if (result == "1") {
            callback(true);
        } else {
            callback(false);
        }
    })
}
//admin
var adminLogin = function (user, pwd, callback) {
    client.get("user_" + user, function (err, uid) {
        if (uid == null) {
            callback(null);
        }
        else {
            client.get("user_pwd_" + uid, function (err, upwd) {
                if (err) {
                    callback(null);
                } else {
                    if (upwd == pwd) {
                        callback(uid);
                    }
                    else {
                        callback(null);
                    }
                }
            });
        }
    });
}
//用户管理
var allUser = function (callback) {
    client.sort("user_id", "get", "#", "get", "user_name_*", "get", "user_static_*", function (err, result) {
        if (err) console.log(err);
        callback(result);

    })

}

//聊天记录
var saveRecord=function(content){
    client.RPUSH('recordList',content,function(err,result){
        console.log('!!!!!!!!!!!!!!!!'+result);
        client.LTRIM('recordList',-4,-1);
    });
}
var chatRecord=function(callback){
    client.lrange('recordList',0,-1,function(err,result){
        console.log(result);
        callback(result);
    });
}

exports.delkeys = delkeys;
exports.findkeys = findkeys;
//登陆和注册
exports.regUser = regUser;
exports.findUser = findUser;
//在线用户
exports.AddOnlineList = AddOnlineList;
exports.PullOnlineList = PullOnlineList;
exports.RefreshOnlineList = RefreshOnlineList;
//禁言
exports.ifStop = ifStop;
exports.stopUser = stopUser;
//admin
exports.adminLogin = adminLogin;
//用户管理
exports.allUser = allUser;
//聊天记录
exports.saveRecord=saveRecord;
exports.chatRecord=chatRecord;