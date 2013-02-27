var index = function (req, res)
{
            if (req.session.user && req.session.user.length)
            {
                res.render('index.html', { user: req.session.user });
            } else
            {
                res.render('index.html', { user: "" });
            }

};
exports.index = index;