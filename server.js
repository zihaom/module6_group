// Import modules
var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var ejs = require('ejs');

//Create server
var app = express();
var server = http.createServer(app);
var listener = socketio.listen(server);
var port = process.env.PORT || 3455;
server.listen(port);

//express --using express for it's nice written interface and fucture ability to expend
app.set('views', './public');
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.get('/', function (req, res) {
    res.render('index.html');
});

//socket.io 
var userCount = 0;
var rooms = {
    "welcome":{"owner":"Z", "members":["Z"], "name":"welcome", "password":"", "banned":["jerk"]}
}
var users = ["Z","jerk"];
listener.sockets.on('connection', function (socket) {
    var login = false;
    socket.on('login', function (userName) {

        console.log("got login");
        if (users.includes(userName)){
            socket.emit('err',{
                errNum:'0'
            });
        }
        else{
            console.log(userName)
            //keeping user data for rooms
            socket.userName = userName;
            ++userCount;
            users.push(userName);
            login = true;
            rooms["welcome"]['members'].push(socket.userName);
            socket.emit('Login', {  
                roomData: rooms["welcome"],
                roomLst: Object.keys(rooms),
                userName:userName,
            });
            listener.sockets.emit('oneLogin', {
                userName: socket.userName,
                userCount: userCount,
            });
        }
    });

    socket.on('disconnect', function () {
        for (var i = 0; i < rooms.length; i++) {
            for (var j = 0; j < rooms[i]['members'].length; j++) {
                if (rooms[i]['members'][j] == socket.userName){
                    rooms[i]['members'].splice(j, 1);
                    break;
                }
            }
        }

        if (login) {
            --userCount;
            login = false;
            listener.sockets.emit('oneGone', {
                userCount: userCount,
                userName: socket.userName,
            });
        }
    });

    socket.on('newMessage', function (data) {
        if (login){
            listener.sockets.emit('newMessage',{
                    userName: socket.userName,
                    room: data.room,
                    text: data.text
            })
        }
        else{
            socket.emit('err',{
                errNum:'0'
            });
        }
    });

    socket.on('passw', function (data) {
        if (login){
            const  newRoom = data.newRoom;
            const  prevRoom = data.prevRoom;
            const  password = data.password;
            if( password === rooms[newRoom].password){
                console.log("in")
                rooms[prevRoom]['members'].splice(rooms[prevRoom]['members'].indexOf(socket.userName), 1);
                rooms[newRoom]['members'].push(socket.userName);
                listener.sockets.emit('changeRoom', {
                    userName: socket.userName,
                    prevRoom:prevRoom,
                    newRoom:newRoom                
                });
                socket.emit('switchRoom',{
                    roomData: rooms[newRoom]
                });
            }
            else{
                console.log("wrong");
                socket.emit('err',{
                    errNum:'4'
                });
            }
        }
        else{
            socket.emit('err',{
                errNum:'0'
            });
        }
    });

    socket.on('changeRoom', function (data) {
        const prevRoom = data.prevRoom;
        const  newRoom = data.newRoom;
        if (login){
            console.log("change");
            console.log(rooms[newRoom]["banned"][0]);
            console.log(rooms[newRoom]["banned"].includes(socket.userName));

            if(!(rooms[newRoom]["banned"].includes(socket.userName) )){
                console.log("check pass");

                if (rooms[newRoom].password != ""){
                    socket.emit('passw',{
                        roomName : newRoom,
                    });
                }else{
                    rooms[prevRoom]['members'].splice(rooms[prevRoom]['members'].indexOf(socket.userName), 1);
                    rooms[newRoom]['members'].push(socket.userName);
                    listener.sockets.emit('changeRoom', {
                        userName: socket.userName,
                        prevRoom:prevRoom,
                        newRoom:newRoom                
                    });
                    socket.emit('switchRoom',{
                        roomData: rooms[newRoom]
                    });
                }
            }
            else{
                console.log("bla");
                socket.emit('err',{
                    errNum:3
                });
            }
        }
        else{
            socket.emit('err',{
                errNum:0
            });
        }
    });

    socket.on('banRoom', function (data) {
        const prevRoom = data.prevRoom;
        const  banned = data.banned;
        rooms[prevRoom]['members'].splice(rooms[prevRoom]['members'].indexOf(banned), 1);
        rooms["welcome"]['members'].push(banned);
        rooms[prevRoom]['banned'].push(banned);
        listener.sockets.emit('changeRoom', {
            userName: banned,
            prevRoom:prevRoom,
            newRoom:"welcome",                
        });
        for (var i in listener.sockets.connected) {
            var s = listener.sockets.connected[i];
            console.log(s.userName);
            console.log(banned);

            if (banned === s.userName) {
                s.emit('switchRoom',{
                    roomData: rooms["welcome"]
                });
            }
        }
    });

    socket.on('kickRoom', function (data) {
        const prevRoom = data.prevRoom;
        const  kicked = data.kicked;
        rooms[prevRoom]['members'].splice(rooms[prevRoom]['members'].indexOf(kicked), 1);
        rooms["welcome"]['members'].push(kicked);
        listener.sockets.emit('changeRoom', {
            userName: kicked,
            prevRoom:prevRoom,
            newRoom:"welcome"                
        });
        for (var i in listener.sockets.connected) {
            var s = listener.sockets.connected[i];
            if (kicked === s.userName) {
                s.emit('switchRoom',{
                    roomData: rooms["welcome"]
                });
            }
        }
    });

    socket.on('createRoom', function (data) {
        const prevRoom = data.prevRoom;
        const  newRoom = data.newRoom;
        const password = data.password;
        if (login){
            if(newRoom != "Z" && !(Object.keys(rooms).includes(newRoom))){
                rooms = Object.assign({[newRoom]:{"owner":socket.userName, "members":[socket.userName], "name":newRoom, "password":password, "banned":[]}},rooms)
                rooms[prevRoom]['members'].splice(rooms[prevRoom]['members'].indexOf(socket.userName), 1);
                console.log(rooms);
                socket.emit('switchRoom',{
                    roomData: rooms[newRoom]
                });
                listener.sockets.emit('createRoom', {
                    userName: socket.userName,
                    prevRoom:prevRoom,
                    roomLst: Object.keys(rooms)
                });
            }
            else{
                socket.emit('err',{
                    errNum:2
                });
            }

        }
        else{
            socket.emit('err',{
                errNum:0
            });
        }
    });
});