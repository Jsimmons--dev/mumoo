import {height, width} from "./gameProperties";


var socket = io();

var me = {};

var ref = new Firebase("https://mumoo.firebaseio.com");
ref.authWithOAuthPopup("github", function (error, authData) {
    if (error) {
        console.log("Login Failed!", error);
    } else {
        me.username = authData.github.username;
        socket.emit('register', authData.github.username);
        console.log("Authenticated successfully");
    }
});


var container = d3.select("#container")
    .append("svg")
    .attr({
        "width": width,
        "height": height
    });

$(document)
    .keydown(
        _.throttle(function (e) {
                //j
                if (e.keyCode == 74 || e.keyCode == 83 || e.keyCode == 40) {
                    socket.emit('request move', {
                        username: me.username,
                        "move": "down"
                    });
                }
                //h
                else if (e.keyCode == 72) {
                    socket.emit('request move', {
                        username: me.username,
                        "move": "left"
                    });
                }
                //k
                else if (e.keyCode == 75) {
                    socket.emit('request move', {
                        username: me.username,
                        "move": "up"
                    });
                }
                //l
                else if (e.keyCode == 76) {
                    socket.emit('request move', {
                        username: me.username,
                        "move": "right"
                    });
                }
                else if (e.keyCode == 81) {
                    socket.emit('request move', {
                        username: me.username,
                        "move": "turnLeft"
                    });
                }
                else if (e.keyCode == 69) {
                    socket.emit('request move', {
                        username: me.username,
                        "move": "turnRight"
                    });
                }
            },
            100));

socket.on('update', function (Players) {


    var existingPlayers = [];
    for (var prop in Players) {
        if (Players.hasOwnProperty(prop)) {
            existingPlayers.push(Players[prop]);
        }
    }
    //rejoin
    var players = container.selectAll(".Player")
        .data(existingPlayers, function (d) {
            return d.username;
        });

    //new guys
    players.enter()
        .append("path")
        .attr({
            "d":"M-10,-10L10,-10L0,15Z",// d3.svg.symbol()
                //.type("triangle-up")
				//.size([200]),
            "id": function (d) {
                return d.username;
            },
            "class": "Player"
        })
		.style({
			"fill":"orange",
			"stroke-width":.5,
			"stroke":"black"
		});

    players.
    transition()
        .duration(220)
        .
    attr({
        "transform": function (d) {
            return "translate(" + [d.x, d.y] + ")"+
			"rotate("+[d.rotate]+")";
        }

    });

    //no longer guys
    players.exit()
        .remove();

	var rotation = d3.select("#" + me.username)
			.each(function(d){
				console.log(d.rotat
			});
});
