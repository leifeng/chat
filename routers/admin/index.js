var redis=require('../RedisHelp');
var index=function(req,res){
    if(!req.session.admin&&!req.session.length)
    {
        res.render('admin/login.html',{info:'请先登陆',query:""});
    }
    else{

        redis.allUser(function(Users){
            if(req.query.id!=null){
                var uid=req.query.id;
                redis.stopUser(uid);
                res.render('admin/index.html',{admin:req.session.admin,Users:Users,query:req.query.id});
            }else{
                res.render('admin/index.html',{admin:req.session.admin,Users:Users,query:""});
            }

        });

    }
}

exports.index = index;
