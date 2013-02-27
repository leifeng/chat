var redis = require("./RedisHelp");

var index = function (req, res) {
    if (req.session.user && req.session.user.length) {
        res.redirect('/index');
    }
    else {
        res.render('login.html', {info:""});
    }

}
var login = function (req, res) {
    var user = req.body.inputName.trim();
    var pwd = req.body.inputPwd.trim();
    redis.findUser(user, pwd, function (uid) {
        if (uid != 0 && uid != null) {
            //redis.AddOnlineList(user,function(result){
            // if(result==1){
            req.session.user = user;
            req.session.uid = uid;
            res.redirect('/index');
            //  }
            // else{
            // res.render("err.html", { err: result});
            // }
            // });
        }
        else {
            res.render("login.html", { info:"用户名或密码不正确" });
        }
    });
}


exports.index = index;
exports.login = login;