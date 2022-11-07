//Open and connect socket
let socket = io();
let myId;
let myPos;

//Listen for confirmation of connection
socket.on('connect', function () {
  console.log("Connected");
});

// listen for what your socket ID is so you know who you are in the object
socket.on('userID', function (socketId) {
  console.log("I am " + socketId);
  myId = socketId;
});


// ------------------This is where you can find variables to play with! myPos contains the distance of x and y from an average of all users' x and y. Theoretically this should mean that it works for as many users as we want to have join. myPos is an object that has the x position, y position, distance from average for x, distance from average for y, and the total distance from the average point. It is console logged in the browser. These elements for the myPos object are defined in the users array in index.js
let player1Img;
let player2Img;
let bg
var song1
// var song2
// var slider
// let c
// let reverb
// let delay


//load bg
function preload() {
  bg = loadImage("background/background_night.jpg");
  player1Img = loadImage("images/monster.gif");
  player2Img = loadImage("images/girl.gif");


  song1 = createAudio("sounds/noise.wav");
  // 	console.log(song1)
}


function mousePressed() {
  // song1.play()
  song1.loop()
  // if (song1.isPlaying()) {
  //   song1.pause()
  // } else {
  //   song1.play()

  // }
  // song1.volume(0.1);

}






function setup() {

  // console.log(bg);
  // let bg;
  // bg = loadImage('/background/background_night.jpg');


  // createCanvas(windowWidth, windowHeight);
  // background(220);


  const myCanvas = createCanvas(windowWidth, windowHeight)
  myCanvas.parent('canvas-container')

  // img = loadImage('background/background_night.jpg')


  //Listen for messages named 'data' from the server, which will contain information about current user's xy position
  socket.on('data', function (users) {

    for (i = 0; i < users.length; i++) {
      if (users[i].id == myId) {
        myPos = users[i];
      }
    }
    // console.log(users);

    //draw an ellipse at each users' mouse position. this is where we could update graphics




    background(bg);
    fill(225, 0, 0);
    

    for (i = 0; i < users.length; i++) {
      push()
      imageMode(CENTER);
      if (i == 0) {
        image(player1Img, users[i].x, users[i].y, 200, 200);
      } else {
        image(player2Img, users[i].x, users[i].y, 200, 200);

      }
      pop()


      calcDistance(users)
    }


  });
}





function mouseMoved() {
  //Grab mouse position
  let mousePos = { x: mouseX, y: mouseY, id: socket.id };
  //Send mouse position object to the server
  socket.emit('data', mousePos);

  // Draw yourself at your xy position
  // ----- this is where you can put something different at the cursor.
  // fill(0);
  // background(255);
  // ellipse(mouseX, mouseY, 10, 10);
}

function calcDistance(users) {
  let maximum =
    window.innerWidth > window.innerHeight
      ? window.innerWidth
      : window.innerHeight


  let mapDistance = map(users[0].totalDist, 0, maximum, 0, 1)
  // console.log(mapDistance);
  if (mapDistance <= 0.2) {
    mapDistance *= 0.2

  } else if (mapDistance > 0.2 && mapDistance < 0.5) {
    mapDistance *= 0.5

  }

  song1.volume(mapDistance);
  // what we are mapping here is distance mapping to volume, map(value, start1, stop1, start2, stop2) 

}

//Expects an object with a and y properties
// function drawPos(pos) {
//   fill(100);
//   ellipse(pos.x, pos.y, 10, 10);
// }