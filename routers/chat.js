
var chat = function (req, res) {
    if (req.session.user && req.session.user.length)
    {
        res.render('chat.html',{user:req.session.user});
    }
    else
    {
        res.redirect('/login');
    }
}

exports.chat = chat;
