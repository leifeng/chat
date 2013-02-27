var out=function(req,res){
    req.session.user=null;
    res.redirect('/index');

}
exports.out=out;