var socket = null;
$(function () {
    var div = document.getElementById('showMsg');
    socket = io.connect();

    //socket监听事件
    var socketListener;
    socketListener = function () {
        socket.on('connect', function () {
            socket.on("system message", function (data) {
                showMsg(data.msg, '', '', '0','');
                refreshOnline(data.online);
            });

            socket.on('public message', function (data) {
                showMsg(data.msg, data.user, '', '1','');

            });

            socket.on('private message', function (data) {
                showMsg(data.msg, data.user, '我', '2','');
            });

            socket.on('err', function (data) {
                showMsg(data.msg, '', '', '3','');
            });

            socket.on('record', function (data) {
                var records = data.msg.toString().split(',');
                for (var i = 0; i < records.length; i++) {
                    var record = records[i].toString().split('|');
                    showMsg(record[0], record[1], '', '4',record[2]);
                }
               var _fenGe='<div class="fenge">-----------------------------↑最近记录↑---------------------------------</div>'
                $("#showMsg").append(_fenGe);
            });
        });
    };

    var refreshOnline = function (userlist) {
        var user = userlist.toString().split(',');
        $('#People').html('');
        $('#PeopleNum').html("在线" + user.length + "人");
        var Peoples;
        for (var i = 0; i < user.length; i++) {
            Peoples="<li><a href='javascript:;'>" + user[i] + "</a></li>";
        }
        $('#People').append(Peoples);
    };
    var sendMsg = function () {
        var msg = $.trim($('#msg').val());
        var _myColor=$.trim($("#mycolor").val());
        if(_myColor==""){_myColor="#918F8F";}
        var content = msg.match(/^@(.+)? (.*)$/);
        if (content) {
            var _content='<span style="color:'+_myColor+'">'+content[2]+'</span>';
            showMsg(_content, '我', content[1], '2','');
            socket.emit("private message", { msg:_content, to:content[1]});
        } else {
            var _content='<span style="color:'+_myColor+'">'+msg+'</span>';
            showMsg(_content, '我', '', '1','');
            socket.emit("public message", { msg:_content });
        }
        $('#msg').val('').focus();
    };

    //替换表情
    function replace_em(str) {
       // str = str.replace(/\</g, '&lt;');
      //  str = str.replace(/\>/g, '&gt;');
        str = str.replace(/\n/g, '<br/>');
        str = str.replace(/\[em_([0-9]*)\]/g, '<img src="img/face/$1.gif" border="0" />');
        return str;
    }
    $('.emotion').qqFace({
        assign:'msg', //给那个控件赋值
        path:'/img/face/'    //表情存放的路径
    });

    //msg 消息内容
    //from 发送消息人
    //to 私聊用 发送给
    //type 消息类型：0系统 1公共 2私聊 3错误
    //t 用于聊天记录 时间
    var showMsg = function (msg, from, to, type,t) {
        var _type = '', _from = '',_time=new Date().format('yyyy-MM-dd h:m:s');

        switch (type) {
            case '0':
                _type = '系统消息'
                break;
            case '1':
                _type = '公共消息'
                _from = '<font color="#FF9966">' + from + '</font>对大家说:'
                break;
            case '2':
                _type = '私聊消息'
                _from = '<font color="#FF9966">' + from + '</font>对<font color="#FF9966">' + to + '</font>说:'
                break;
            case '3':
                _type = '错误信息'
                break;
            case '4':
                _type = '聊天记录'
                _from = '<font color="#FF9966">' + from + '</font>对大家说:'
                _time=t;
                break;
        }
        var html = '<div class="message-bg-' + type + ' message-content">'
            + '<div class="message-type-' + type + '">&nbsp;&nbsp;['
            + _type
            + ']</div>'
            + '<div class="message-text"><span class="message-from">'
            + _from
            + '</span>'
            +replace_em(msg)
            + '</div>'
            + '<div class=message-time>'
            + _time
            + '&nbsp;&nbsp;</div>'
            + '</div>' ;
        $("#showMsg").append(html);
        div.scrollTop = div.scrollHeight;
//        var timerArr = $.blinkTitle.show();
//        setTimeout(function () {        //此处是过一定时间后自动消失
//            $.blinkTitle.clear(timerArr);
//        }, 2000);
    }

    var start = function () {
        socketListener();
        $("#sendButton").bind('click', function () {
            sendMsg();
        });
        $("#exit").bind('click', function () {
            socket.emit('disconnect');
            location.href = '/';
        });
        $("#clear").bind('click', function () {
            $("#showMsg").html("");
        });
        $("#People li a").on('click', function () {
            $("#msg").val('@' + $(this).text() + ' ').focus();
        });

        //回车提交
        $("#msg").keypress(function (e) {
            e = window.event || e;
            if (e.keyCode == 13) {
                sendMsg();
                return false;
            }
        });

        //禁止f5
        $(document).keydown(function (e) {
            e = window.event || e;
            if (e.keyCode == 116) {
                e.keyCode = 0;
                return false;
            }
        });

        $('#mycolor').colorpicker({
            format:'hex'
        });
    };
    start();
});

