var redis=require('../RedisHelp');
var index=function(req,res){
    if(!req.session.admin&&!req.session.length)
    {
        res.render('admin/login.html',{info:'请先登陆'});
    }
    else{
        redis.allUser(function(Users){
            res.render('admin/index.html',{admin:req.session.admin,Users:Users});
        });

    }
}

exports.index = index;