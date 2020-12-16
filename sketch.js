var mario, mario_running, mario_collided;
var ground, groundImage;
var backGround, backGroundImage;
var obstacle, obstacle1, obstacle2, obstacle3, obstacle4;
var restart, gameOver, restartImage, gameOverImage;
var brick;

var brickGroup, obstacleGroup;

var dieSound, jumpSound, checkPointSound;

var invisibleGround;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var score = 0;

function preload() {
  mario_running = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png");
  groundImage = loadImage("ground2.png");

  backGroundImage = loadImage("bg.png");

  obstacle1 = loadAnimation("obstacle1.png", "obstacle2.png");
  obstacle2 = loadAnimation("obstacle3.png", "obstacle4.png");


  mario_collided = loadAnimation("collided.png");

  gameOverImage = loadImage("gameOver.png")
  restartImage = loadImage("restart.png")

  brickImage = loadImage("brick.png");

  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");
  checkPointSound = loadSound("checkPoint.mp3");

}

function setup() {
  createCanvas(600, 400);

  backGround = createSprite(300, 200, 300, 200);
  backGround.addImage(backGroundImage);
  backGround.x = backGround.width / 2;
  // backGround.scale = 1.9;
  // mario.depth = backGround.depth + 1;

  //Creating ground
  ground = createSprite(200, 373, 400, 27);
  // ground.visible = false;
  ground.addImage("Ground", groundImage);
  // ground.scale = 1.2;
  // ground.depth = backGround.depth + 1;

  invisibleGround = createSprite(200, 340, 400, 35);
  invisibleGround.visible = false;


  //Creating mario
  mario = createSprite(50, 300, 50, 60);
  mario.addAnimation("mario_running", mario_running);
  mario.scale = 1.8;
  mario.addAnimation("mario_collided", mario_collided);

  mario.setCollider("circle", 0, 0, 10);
  // mario.debug = true;

  gameOver = createSprite(300, 140, 50, 10);
  gameOver.addImage("game_over", gameOverImage);
  gameOver.scale = 0.5;

  restart = createSprite(300, 170, 50, 10);
  restart.addImage("restart", restartImage);
  restart.scale = 0.5;

  obstacleGroup = new Group();
  brickGroup = new Group();
}

function draw() {

  background(220);

  if (gameState === PLAY) {
    ground.velocityX = -(6 + score/100);
    gameOver.visible = false;
    restart.visible = false;

    // console.log(backGround.x);

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }


    if (keyDown("space") && mario.y > 150) {
      mario.velocityY = -10;
      jumpSound.play();
    }

    mario.velocityY = mario.velocityY + 0.8;

    spawnBricks();
    spawnObstacles();

    if (obstacleGroup.isTouching(mario)) {
      gameState = END;
      dieSound.play();
      //Applying AI
      // mario.velocityY = -10;
      // jumpSound.play();
    }


    for (var i = 0; i < brickGroup.length; i++) {
      if (brickGroup.get(i).isTouching(mario)) {
        brickGroup.get(i).remove()
        score = score + 1;
      }
    }

    if (score > 0 && score % 100 === 0) {
      checkPointSound.play();
    }

  }

  if (gameState === END) {
    ground.velocityX = 0;
    mario.velocityY = 0;

    obstacleGroup.setVelocityXEach(0);
    brickGroup.setVelocityXEach(0);

    gameOver.visible = true;
    restart.visible = true;

    mario.changeAnimation("mario_collided", mario_collided);



    obstacleGroup.setLifetimeEach(-1);
    brickGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      reset();
    }
  }

  mario.collide(invisibleGround);
  drawSprites();
  textSize(16);
  fill("yellow");
  text("Score:" + score, 520, 30);
}

function spawnBricks() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    brick = createSprite(600, 300, 40, 10);
    brick.y = Math.round(random(150, 250));
    brick.addImage(brickImage);
    // brick.scale = 0.5;
    brick.velocityX = -(4 + score/100);

    //assign lifetime to the variable
    brick.lifetime = 200;

    //adjust the depth
    brick.depth = mario.depth;
    mario.depth = mario.depth + 1;

    brickGroup.add(brick);
  }

}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 310, 10, 60);
    obstacle.velocityX = -(6 + score/100);

    // //generate random obstacles
    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1:
        obstacle.addAnimation("obstacle1", obstacle1);
        break;
      case 2:
        obstacle.addAnimation("obstacle2", obstacle2);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle           
    // obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    obstacleGroup.add(obstacle);

  }

}


function reset() {
  gameState = PLAY;

  gameOver.visible = false;
  restart.visible = false;

  obstacleGroup.destroyEach();
  brickGroup.destroyEach();

  mario.changeAnimation("mario_running", mario_running);

  score = 0;

}