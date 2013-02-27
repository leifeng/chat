var redis=require('./RedisHelp');
var index=function(req,res){
    redis.delkeys(function(){
        res.render('delkey.html');
    });

}
exports.index=index;