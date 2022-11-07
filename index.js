//Initialize the express 'app' object
let express = require('express');
let app = express();
app.use('/', express.static('public'));

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

//Initialize socket.io
let io = require('socket.io');
io = new io.Server(server);

let users = [];
let currentUser;
let userGone;
let distBetween;


//Listen for individual clients/users to connect
io.sockets.on('connection', function (socket) {
    console.log("We have a new client: " + socket.id);
    //on connection from a new browser, add socket.id to an array, initialize it at X=0 y=0
    users.push({
        x: 0,
        y: 0,
        id: socket.id,
        xDist: 0,
        yDist: 0,
        totalDist: 0
    });
    console.log(users[0]);
    //when a user joins, send that user its own socket ID
    socket.emit('userID', socket.id);

    //Listen for a message named 'data' from this client
    socket.on('data', function (data) {
        //Data can be numbers, strings, objects
        console.log("Received: 'data' " + data);

        //assign incoming user data to an index in our users array so we can distinguish between users.
        //check incoming data.socket.id against the socket ids of the users that have connected
        //identify which user's data is associated with the data that has come in
        for (i = 0; i < users.length; i++) {
            if (users[i].id == data.id) {
                currentUser = i;
            }
        }


        //grab incoming data of mouseX and mouseY and update users array with current XY data
        users[currentUser].x = data.x;
        users[currentUser].y = data.y;

        //-----------calculate distances ---------
        let xTotal = 0;
        let yTotal = 0;

        // establish an average point between the xy coordinates of the users
        for (i = 0; i < users.length; i++) {
            xTotal = users[i].x + xTotal;
            yTotal = users[i].y + yTotal;
        }

        let avgX = xTotal / users.length;
        let avgY = yTotal / users.length;

        // calculate the distance between the user and the average point

        for (i = 0; i < users.length; i++) {
            users[i].xDist = users[i].x - avgX;
            users[i].yDist = users[i].y - avgY;
            let x = users[i].xDist;
            let y = users[i].yDist;
            distBetween = Math.sqrt(x * x + y * y);
            users[i].totalDist = distBetween;
        }

        console.log("distance =" + distBetween);



        //Send the data to all clients, including this one
        //Set the name of the message to be 'data'
        io.sockets.emit('data', users);

        //Send the data to all other clients, not including this one
        // socket.broadcast.emit('data', data);

        //Send the data to just this client
        // socket.emit('data', data);
    });

    //Listen for this client to disconnect, then remove them from the array of users
    socket.on('disconnect', function () {
        console.log("A client has disconnected: " + socket.id);

        for (i = 0; i < users.length; i++) {
            if (users[i].id == socket.id) {
                userGone = i;
            }
        }
        users.splice(userGone, 1);
        console.log("this guy left" + userGone);
        console.log("these are here" + users);
    });
});