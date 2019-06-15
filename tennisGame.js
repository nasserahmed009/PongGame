let canvas = document.getElementById('canvas');
let canvasContext = canvas.getContext('2d');

let playGame = false;

let playGroundColor = 'black';
let ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let dx = document.getElementById('ballSpeed').value; //horizontal speed of the ball
let dy = document.getElementById('ballSpeed').value; // vertical speed of the ball
let framesPerSecond = 60;

// paddles variables
let paddleHeight = 100;
let paddleWidth = 10;
let paddle1Y = 100;
let paddle2Y = 100;

let player1Name = document.getElementById('player1Name').value;
let player1Score = 0;
let player2Score = 0;

function startPauseGame(event){
  event.preventDefault();
  playGame = !playGame;
  if(playGame){
    event.target.text = "Pause";
    event.target.style.background = "#ff4444";
  }else{
    event.target.text = "Play";
    event.target.style.background = "#00c14d";
  }

}

function changePlayGroundColor(event, color){
  event.preventDefault();
  playGroundColor = color;
  console.log(event);
  document.getElementById('activeColor').removeAttribute('id');
  event.target.innerHTML = "<i class='fas fa-check'></i>";
  event.target.setAttribute('id', 'activeColor');
}

function changeBallSpeed(){
  resetGame();
  dx = dy = document.getElementById('ballSpeed').value;
}

function drawPlayground(color){
  canvasContext.fillStyle = color;
  canvasContext.fillRect(0,0,canvas.width, canvas.height);
}

function drawNet(){
  canvasContext.fillStyle = "white";
  let netWidth = 6;
  let netHeight = 30;
  for(let i=0; i< canvas.height; i+=netHeight+15)
    canvasContext.fillRect((canvas.width/2)-netWidth,i,netWidth, netHeight);
}

function drawTennisBall(){
  canvasContext.fillStyle = "white";
  canvasContext.beginPath();
  canvasContext.arc(ballX, ballY, ballRadius, 0, Math.PI*2, true);
  canvasContext.fill();
}

function drawPaddles(){
  canvasContext.fillStyle = "white";
  canvasContext.fillRect(0,paddle1Y,paddleWidth, paddleHeight);
  canvasContext.fillRect(canvas.width - paddleWidth ,paddle2Y,paddleWidth, paddleHeight);
}

function drawScores(){
  canvasContext.fillText(player1Name + " =", 50, 50);
  canvasContext.fillText(player1Score, 50, 70);
  canvasContext.fillText("Player2 score = ", canvas.width-130, 50);
  canvasContext.fillText(player2Score, canvas.width-130, 70);
}

function updateNames(){
  player1Name = document.getElementById('player1Name').value;
}
//reset the postition of the ball to the center of the playGround
function resetGame(){
  ballX = canvas.width/2;
  ballY = canvas.height/2;
  paddleHeight= 100;
  paddle1Y = canvas.height/2 - paddleHeight/2;
  paddle2Y = canvas.height/2 - paddleHeight/2;
  dx=-dx;
}

function increaseDifficulty(){
  if(paddleHeight>30) paddleHeight--;

  //increase the speed of the ball
  if(dx<0) dx--;
  else dx++;
  if(dy<0) dy--;
  else dy++;
}

function getMousePosition(event){
  let playGround = canvas.getBoundingClientRect();
  let root = document.documentElement;

  console.log(event.y);
  console.log(playGround.top);
  console.log(root.scrollTop);

  return {
    x: event.x - playGround.left,
    y: event.y - playGround.top ,
  }
}

function computerPaddlePlay(){
  if(paddle2Y+paddleHeight/2 < ballY-45) paddle2Y+=6;
  else if(paddle2Y+paddleHeight/2 > ballY+45) paddle2Y-=6;
}

function moveBall(){
  ballX += dx;
  ballY += dy;

  // ball postition for player1
  if(ballX < 0 + ballRadius){
    if(ballY>paddle1Y && ballY<paddle1Y+paddleHeight)dx=-dx;
    else{
      player2Score++;
      playGame = false;
      //adding delay to the game when a player scores
      setTimeout(function(){
        resetGame();
        playGame = true;
      },1000);
    }
  }


  //ball postition for player2
  if(ballX > canvas.width - ballRadius){
    if(ballY>paddle2Y && ballY<paddle2Y+paddleHeight) dx=-dx;
    else {
      player1Score++;
      playGame = false;
      //adding delay to the game when a player scores
      setTimeout(function(){
        resetGame();
        playGame = true;
      },1000);
    }
  }

  // bouncing on hitting the top and bottom edges
  if(ballY > canvas.height - ballRadius || ballY < 0 + ballRadius){
    dy=-dy;
  }
}

canvas.addEventListener('mousemove', function(event){
  if(!playGame) return;
  let mousePos = getMousePosition(event);
  console.log(mousePos);

  //moving paddle1 with the movement of mouse
  paddle1Y = mousePos.y - paddleHeight/2; //to move the paddle from its center

});

setInterval(function(){
  drawPlayground(playGroundColor);
  drawNet();
  drawScores();
  drawPaddles();
  drawTennisBall();
  if(!playGame) return;
  computerPaddlePlay();
  moveBall();
}, 1000/framesPerSecond);



//increase the difficulty of the game every 5 seconds
setInterval(increaseDifficulty(), 1000);
