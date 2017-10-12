var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/bell002.html');
});

var user_count = 0;

//當新的使用者連接進來的時候
io.on('connection', function(socket) {

    //新user
    socket.on('add user', function(msg) {
        socket.username = msg;
        console.log("new user:" + msg + " logged.");
        io.emit('add user', {
            username: socket.username
        });
    });

    //監聽新訊息事件
    socket.on('chat message', function(data) {
        console.log(socket.username + ":" + data);

        //發佈新訊息
        io.emit('chat message', data);
    });

    //left
    socket.on('disconnect', function() {
        console.log(socket.username + " left.");
        io.emit('user left', {
            username: socket.username
        });
    });


});

//指定port
http.listen(process.env.PORT || 3000, function() {
    console.log('listening on *:3000');
});