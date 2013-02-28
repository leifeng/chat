var redis = require("./RedisHelp");

var index = function (req, res) {

    if (req.session.user && req.session.user.length)
    {
        res.redirect('/index');
    }
    else
    {
        res.render('reg.html',{info:""});
    }
}

var reg = function (req, res) {
    var user = req.body.inputName.trim();
    var pwd = req.body.inputPwd.trim();
    redis.regUser(user, pwd, function (uid) {
        if (uid !=0 &&uid!="") {
            req.session.user = user;
            req.session.uid=uid;
            res.redirect('/index');
         } else {
           res.render('reg.html', { info: "用户已存在" });
      }
   });
}

exports.index = index;
exports.reg = reg;