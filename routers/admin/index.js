var redis = require('../RedisHelp');
var index = function (req, res) {
    if (!req.session.admin && !req.session.length) {
        res.render('admin/login.html', {info:'请先登陆'});
    }
    else {
        if (req.query.id != null) {
            var uid = req.query.id;
            redis.speakManage(uid, function () {
                redis.allUser(function (Users) {
                    res.render('admin/index.html', {admin:req.session.admin, Users:Users});
                });
            });
        } else if (req.query.del != null) {
            var uid = req.query.del;
            redis.delUser(uid, function () {
                redis.allUser(function (Users) {
                    res.render('admin/index.html', {admin:req.session.admin, Users:Users});
                });
            });
        }
        else {
            redis.allUser(function (Users) {
                res.render('admin/index.html', {admin:req.session.admin, Users:Users});
            });
        }
    }
}

exports.index = index;
