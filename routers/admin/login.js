var redis = require("../RedisHelp");

var index = function (req, res) {
    if (req.session.admin && req.session.admin.length) {
        res.redirect('admin/index');
    }
    else {
        res.render('admin/login.html', {info:""});
    }

}
var login = function (req, res) {
    var user = req.body.user.trim();
    var pwd = req.body.pwd.trim();
    redis.adminLogin(user, pwd, function (uid) {
        if (uid==1) {
            req.session.admin = user;
            req.session.uid = uid;
            res.redirect('admin/index');
        }
        else {
            res.render("admin/login.html", { info:"用户名或密码不正确" });
        }
    });
}
exports.index = index;
exports.login = login;