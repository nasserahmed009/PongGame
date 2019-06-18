let canvas = document.getElementById('canvas');
let canvasContext = canvas.getContext('2d');

let pauseGame = true;
let showingScreen = false; // if levelup or game over screens are showed

let playGroundColor = 'black';
let ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let dx = parseInt(document.getElementById('ballSpeed').value); //horizontal speed of the ball
let dy = parseInt(document.getElementById('ballSpeed').value); // vertical speed of the ball
let framesPerSecond = 60;

let gameLevel = 1;

// paddles variables
let paddleHeight = 100;
let paddleWidth = 10;
let paddle1Y = 100;
let paddle2Y = 100;

let player1Name = document.getElementById('player1Name').value;
let player1Score = 0;
let player2Score = 0;
let finalScore = 3;

function startPauseGame(event){
  event.preventDefault();
  pauseGame = !pauseGame;
  if(!pauseGame){
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
  resetPositionsAndSpeeds();
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

function drawScoresAndLevel(){
  canvasContext.fillStyle = "white";
  canvasContext.font = "10px PressStart2P";
  canvasContext.fillText(player1Name + " = " + player1Score, 50, 50);
  canvasContext.fillText("Player2 = "+ player2Score, canvas.width-160, 50);

  // print level
  let levelText = "LEVEL " + gameLevel;
  canvasContext.fillStyle = playGroundColor;
  canvasContext.fillRect((canvas.width/2) - (canvasContext.measureText(levelText).width/2) - 10 ,30,canvasContext.measureText(levelText).width+20, 35);
  canvasContext.fillStyle = '#fff';
  canvasContext.fillText(levelText, (canvas.width/2) - (canvasContext.measureText(levelText).width/2) , 50);
}

function updateNames(){
  player1Name = document.getElementById('player1Name').value;
}
//reset the postition of the ball to the center of the playGround
function resetPositionsAndSpeeds(){
  ballX = canvas.width/2;
  ballY = canvas.height/2;
  paddle1Y = canvas.height/2 - paddleHeight/2;
  paddle2Y = canvas.height/2 - paddleHeight/2;
  dy = parseInt(document.getElementById('ballSpeed').value);
  dx=-dx;
}

function increaseDifficulty(){
  if(paddleHeight>30) paddleHeight-=2;

  //increase the speed of the ball
  if(dx<0) dx--;
  else dx++;
  if(dy<0) dy--;
  else dy++;
}


function showLevelUpWindow(){
  drawPlayground(playGroundColor);
  canvasContext.fillStyle = "white";
  canvasContext.font = "10px PressStart2P";
  canvasContext.fillText("LEVEL UP", (canvas.width/2)-((canvasContext.measureText("LEVEL UP").width)/2), canvas.height/2);
  canvasContext.fillText("click to level up", (canvas.width/2)-((canvasContext.measureText("click to level up").width)/2), canvas.height/2 + 50);
}

function shhowGameOverWindow(){
  drawPlayground(playGroundColor);
  canvasContext.fillStyle = "white";
  canvasContext.font = "10px PressStart2P";
  canvasContext.fillText("GAME OVER", (canvas.width/2)-((canvasContext.measureText("GAME OVER").width)/2), canvas.height/2);
  canvasContext.fillText("click to start new game", (canvas.width/2)-((canvasContext.measureText("click to start new game").width)/2), canvas.height/2+20);
}

function checkWinner(){
  if(player1Score>finalScore){
    showLevelUpWindow();
    showingScreen = true;
    return true;
  }else if(player2Score>finalScore){
    shhowGameOverWindow();
    showingScreen = true;
    return true;
  }else{
    showingScreen = false;
    return false;
  }
}

function levelUp(){
  gameLevel++;
  player1Score  = 0;
  player2Score = 0;
  increaseDifficulty();
  showingScreen = false;
}

function resetGame(){
  resetPositionsAndSpeeds();
  gameLevel = 1;
  player1Score = 0;
  player2Score = 0;
  showingScreen = false;
}

function getMousePosition(event){
  let playGround = canvas.getBoundingClientRect();
  let root = document.documentElement;

  return {
    x: event.x - playGround.left,
    y: event.y - playGround.top ,
  }
}

function computerPaddlePlay(){
  if(paddle2Y+paddleHeight/2 < ballY-30){
    let increment = parseInt(document.getElementById('ballSpeed').value)+4.5;
    if(increment<7) increment=7;
    if(increment>11) increment=11;
    paddle2Y+= increment;
  }
  else if(paddle2Y+paddleHeight/2 > ballY+30) {
    let decrement = parseInt(document.getElementById('ballSpeed').value)+4.5;
    if(decrement<7) decrement=7;
    if(decrement>11) decrement=11;
    paddle2Y-= decrement;
  }
}

function moveBall(){
  ballX += dx;
  ballY += dy;

  // ball postition for player1
  if(ballX < 0 + ballRadius){
    if(ballY>paddle1Y && ballY<paddle1Y+paddleHeight){
      dx=-dx;

      let deltaY = ballY - (paddle1Y+paddleHeight)/2;
      dy = deltaY*0.06;
    }
    else{
      player2Score++;
      checkWinner();
      pauseGame = true;
      //adding delay to the game when a player scores
      setTimeout(function(){
        resetPositionsAndSpeeds();
        pauseGame = false;
      },1000);
    }
  }


  //ball postition for player2
  if(ballX > canvas.width - ballRadius){
    if(ballY>paddle2Y && ballY<paddle2Y+paddleHeight){
       dx=-dx;

       let deltaY = ballY - (paddle2Y+paddleHeight)/2;
       dy = deltaY*0.05;
     }
    else {
      player1Score++;
      checkWinner();
      pauseGame = true;
      //adding delay to the game when a player scores
      setTimeout(function(){
        resetPositionsAndSpeeds();
        pauseGame = false;
      },1000);
    }
  }

  // bouncing on hitting the top and bottom edges
  if(ballY > canvas.height - ballRadius || ballY < 0 + ballRadius){
    dy=-dy;
  }
}

canvas.addEventListener('mousemove', function(event){
  if(pauseGame) return;
  let mousePos = getMousePosition(event);
  //moving paddle1 with the movement of mouse
  paddle1Y = mousePos.y - paddleHeight/2; //to move the paddle from its center
});

canvas.addEventListener('click', function(){
  if(!showingScreen) return;
  if(player1Score>player2Score) levelUp();
  else resetGame();
});



setInterval(function(){
  if(showingScreen) return;
  drawPlayground(playGroundColor);
  drawNet();
  drawScoresAndLevel();
  drawPaddles();
  drawTennisBall();
  if(pauseGame) return;
  computerPaddlePlay();
  moveBall();
}, 1000/framesPerSecond);



//increase the difficulty of the game every 5 seconds
setInterval(increaseDifficulty(), 1000);
