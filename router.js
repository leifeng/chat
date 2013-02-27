var index = require("./routers/index");
var chat = require("./routers/chat");
var bbs = require("./routers/bbs");
var login = require("./routers/login");
var reg=require("./routers/reg");
var out=require("./routers/out");
var del=require("./routers/delkeys");
//admin
var admin_login=require('./routers/admin/login');
var admin_index=require('./routers/admin/index');
module.exports = function (app) {
    app.get('/', index.index);
    app.get('/index', index.index);

    app.get('/chat', chat.chat);

    app.get('/bbs', bbs.bbs);

    app.get('/login', login.index);
    app.post('/login', login.login);

    app.get('/reg', reg.index);
    app.post('/reg', reg.reg);

    app.get('/out',out.out);

    app.get('/del',del.index);
//admin
    app.get('/admin',admin_login.index);
    app.get('/admin/login',admin_login.index);
    app.post('/admin/login',admin_login.login);
    app.get('/admin/index',admin_index.index);

};
