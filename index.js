var app = require('express')();
var express = require('express');
var http = require('http')
    .Server(app);
var io = require('socket.io')(http);
var path = require('path');

var Firebase = require('firebase');
var usersBase = new Firebase('https://mumoo.firebaseio.com/users');

app.use(express.static('app'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/app/index.html'));
});

var PlayerIds = {};
var Players = {};

var moves = {};
var moveSpeed = 20;
var turnSpeed = 36;
moves.up = function (username, socket) {
    Players[username].y -= moveSpeed;
};
moves.down = function (username, socket) {
    Players[username].y += moveSpeed;
};
moves.left = function (username, socket) {
    Players[username].x -= moveSpeed;
};
moves.right = function (username, socket) {
    Players[username].x += moveSpeed;
};
moves.turnRight = function (username, socket) {
    Players[username].rotate += turnSpeed;
};
moves.turnLeft = function (username, socket) {
    Players[username].rotate -= turnSpeed;
};

io.on('connection', function (socket) {
    socket.on('register', function (name) {
        Players[name] = socket.id;
		PlayerIds[socket.id] = name;
        usersBase.child(name)
            .once('value', function (snap) {
                if (snap.val() === null) {
                    newPlayer = {
                        username: name,
                        x: 100,
                        y: 100,
						rotate: 0,
                    };
                    usersBase.child(name)
                        .set(newPlayer,
                            function (error) {
                                Players[name] = newPlayer;
                               io.sockets.emit('update', Players);
                            }
                        );

                } else {
                    Players[name] = snap.val();
                    io.sockets.emit('update', Players);
                }
            });
    });

    socket.on('request move', function (playerMove) {
        if (validMove(playerMove)) {
            moves[playerMove.move](playerMove.username, socket);
			io.sockets.emit('update',Players);
        }
    });

    socket.on('disconnect', function () {
			Players[PlayerIds[socket.id]] = undefined;
			PlayerIds[socket.id] = undefined;
			io.sockets.emit('update',Players);
        });
});

function validMove(move) {
    return true;
}

var port = 23317;
http.listen(port, function () {
    console.log('listening on *:'+port);
});
