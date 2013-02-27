var mongo = require('mongoskin');
//var db = mongo.db('mongodb://study:pwdstudy@linus.mongohq.com:10049/study_289528400');
var db = mongo.db('localhost:27017/test');
var findall = function (coll_name, callback)
{
    db.collection(coll_name).find().toArray(function (err, posts)
    {
        if (!err)
        {
            var result = "";
            for (var i = 0; i < posts.length; i++)
            {
                var data = posts[i];
                result += data.username;

            }
            callback(result);
        }
    });
}

var finduser = function (coll_name, values, callback)
{
    db.collection(coll_name).find({ 'username': values }).toArray(function (err, posts)
    {
        if (posts.length > 0)
        {
            for (var i = 0; i < posts.length; i++)
            {
                var firstResult = posts[i];
                var resultSet = firstResult.username;
                callback(resultSet);
            }
        } else
        {
            callback(null);
        }


    });
}


var insert = function (coll_name, key, value, callback)
{
    db.collection(coll_name).insert({ ket: value }, function (err, posts)
    {
        if (!err) callback(posts);
        db.close();
    });
}
exports.finduser = finduser;
exports.findall = findall;
exports.insert = insert;