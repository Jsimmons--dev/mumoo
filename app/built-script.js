(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var width = 500;
exports.width = width;
var height = 500;

exports.height = height;
var startingHealth = 100;
exports.startingHealth = startingHealth;

},{}],2:[function(require,module,exports){
"use strict";

var _gameProperties = require("./gameProperties");

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

var container = d3.select("#container").append("svg").attr({
    "width": _gameProperties.width,
    "height": _gameProperties.height
});

$(document).keydown(_.throttle(function (e) {
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
                } else if (e.keyCode == 81) {
                    socket.emit('request move', {
                        username: me.username,
                        "move": "turnLeft"
                    });
                } else if (e.keyCode == 69) {
                    socket.emit('request move', {
                        username: me.username,
                        "move": "turnRight"
                    });
                }
}, 100));

socket.on('update', function (Players) {

    var existingPlayers = [];
    for (var prop in Players) {
        if (Players.hasOwnProperty(prop)) {
            existingPlayers.push(Players[prop]);
        }
    }
    //rejoin
    var players = container.selectAll(".Player").data(existingPlayers, function (d) {
        return d.username;
    });

    //new guys
    players.enter().append("path").attr({
        "d": "M-10,-10L10,-10L0,15Z", // d3.svg.symbol()
        //.type("triangle-up")
        //.size([200]),
        "id": function id(d) {
            return d.username;
        },
        "class": "Player"
    }).style({
        "fill": "orange",
        "stroke-width": .5,
        "stroke": "black"
    });

    players.transition().duration(220).attr({
        "transform": function transform(d) {
            return "translate(" + [d.x, d.y] + ")" + "rotate(" + [d.rotate] + ")";
        }

    });

    //no longer guys
    players.exit().remove();

    var rotation = d3.select("#" + me.username).each(function (d) {
        console.log(d.rotate);
    });
});

},{"./gameProperties":1}]},{},[2]);
