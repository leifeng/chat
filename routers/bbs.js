//var mysql = require("mysql");
//
var bbs = function (req, res) {
//
//    var db = mysql.createConnection({
//        host:'',
//        port:'3306',
//        user:'',
//        password:'',
//        database:''
//    });
//    db.connect(function (err) {
//        if (err) res.render("bbs.html", { title:err, data:err });
//    });
//    db.query("SELECT tid,subject FROM pre_forum_thread ORDER BY tid DESC ", function (err, results, fields) {
//        if (err) res.render("bbs.html", { title:err, data:err });
//        var data = '';
//        for (var i = 0; i < results.length; i++) {
//            var Result = results[i];
//            data += 'tid' + Result['tid'] + 'subject' + Result['subject'] + '<br/>';
//        }
//
//        res.render("bbs.html", { data:data, title:"dddd" });
//    });
//    db.end();
}
exports.bbs = bbs;

