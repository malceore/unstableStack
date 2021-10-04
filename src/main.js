"use strict";
const resources = [
  "res/images/LBlock.png",
  "res/images/lineBlock.png",
  "res/images/SBlock.png",
  "res/images/squareBlock.png",
  "res/images/unstableStackTitle.png",
  "res/images/unstableStackBG.png",
  "res/images/creditsMonster.png",
  "res/sounds/blip.wav",
  "res/sounds/blip2.wav",
  "res/sounds/blip3.wav",
  "res/sounds/thud.wav",
  "res/sounds/thud_2.wav",
  "res/sounds/thud_3.wav",
  "res/sounds/explosion.wav",
  "res/sounds/explosion2.wav",
  "res/sounds/usedStatic.wav",
  "res/sounds/usedStatic2.wav"
];
var g = hexi(500, 520, mainMenu, resources, load);
g.scaleToWindow();
g.backgroundColor = 'grey';
// globals
let physics = new Array();
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Runner = Matter.Runner;
var engine = Engine.create({render: { element: document.body,controller: Matter.RenderPixi}});
var runner = Runner.create();  
// Needs to be above adn thus behind platform.
var background = g.sprite("res/images/unstableStackBG.png");
var spawner = createSpawner();
var platform = createPlatform();
var staticChargeBar;
var towerCenter = {'x':0, 'y':0};
var towerCenterLine = g.line("blue", 2, 0, -platform.sprite.height/2, g.canvas.width, -platform.sprite.height/2);
var goalLine = g.line("red", 2, 0, -400, g.canvas.width, -400);
var choiceMenu;
var helpMenu;
var blockDampening = 10;
let stackedBlocks = new Array();
var score;
var currentBlock = {};
var currentLevel = 0;
let soundEffects;
g.start();

function load() {
  console.log(`loading: ${g.loadingFile}`);
  console.log(`progress: ${g.loadingProgress}`);
  g.loadingBar();
  document.getElementsByTagName("canvas")[0].focus();
}


function mainMenu(){
  // Need to relocate this somewhere better.
  loadSounds();
  background.y = -((background.height - g.canvas.height) - 500);
  var title = g.sprite("res/images/unstableStackTitle.png");
  title.scaleX = title.scaleY = 0.8;
  g.shake(title);
  const play = g.rectangle(80, 50, menuColor, "black", menuLineWidth, 0, 0);
  var playText = g.text("Play", "18px puzzler", "black");
  playText.y = 12;
  playText.x = 20;
  play.addChild(playText);
  play.y = 100;
  play.interact = true;
  play.tap = () => {
    soundEffects.blip3.play();
    remove(container);
    remove(monster);
    loadLevel(levels[currentLevel]);
  }

  var monster = g.sprite("res/images/creditsMonster.png");
  monster.scaleX = monster.scaleY = 0.6;
  monster.x = g.canvas.width;
  monster.y = g.canvas.height * 0.6;

  const credit = g.rectangle(80, 50, menuColor, "black", menuLineWidth, 0, 0);
  var creditText = g.text("Credits", "18px puzzler", "black");
  creditText.y = 10;
  creditText.x = 10;
  credit.addChild(creditText);
  credit.y = 200;
  credit.interact = true;
  credit.tap = () => {
    soundEffects.blip3.play();
    g.slide(monster, monster.x-300, monster.y);
  }

  var container = g.group(title, play, credit);
  g.stage.putCenter(container);
}

function loadLevel(level){
  // Run first time setup or run cleanup. Easy.
  if (level.id == 1){
    setup()
  } else {
    cleanUpLevel();
  }

  // Update help per level.
  if (level.help){
    console.log(helpMenu);
    helpMenu.text.text = level.help;
    helpMenu.tag.tap();
  }

  goalLine.ay = goalLine.by = level.winConditionHeight;
  g.resume();
  g.state = play;
}


function setup() {
  staticChargeBar = createStaticChargeBar();
  resetButton();
  score = createScore();
  towerCenterLine.x -= platform.sprite.x - (platform.sprite.width/2);
  platform.sprite.addChild(towerCenterLine);
  goalLine.x -= platform.sprite.x - (platform.sprite.width/2);
  goalLine.alpha = towerCenterLine.alpha = 0.2;
  platform.sprite.addChild(goalLine);
  physics.push(platform);

  World.add(engine.world, [platform.body]);
  engine.world.gravity.y = 0.09;
  engine.positionIterations = 10;
  engine.velocityIterations = 10;
  //engine.enableSleeping = true;
  runner.delta = 100/30;

  choiceMenu = choiceMenu();
  initKeyboard();
  helpMenu = helpMenu();
}


function loadSounds(){
  soundEffects = {
    blip1: g.sound("res/sounds/blip.wav"),
    blip2: g.sound("res/sounds/blip2.wav"),
    blip3: g.sound("res/sounds/blip3.wav"),
    thud: g.sound("res/sounds/thud.wav"),
    thud2: g.sound("res/sounds/thud_2.wav"),
    thud3: g.sound("res/sounds/thud_3.wav"),
    explosions: g.sound("res/sounds/explosion.wav"),
    explosions2: g.sound("res/sounds/explosion2.wav"),
    usedStatic: g.sound("res/sounds/usedStatic.wav"),
    usedStatic2: g.sound("res/sounds/usedStatic2.wav")
  };
  soundEffects.explosions2.volume = 0.5;
}


function updateStackedBlocks(){
  let blocks = new Array();
  
  physics.forEach(function (element, value) {
    // Is it colliding with the platform
    let platformCollided = Matter.SAT.collides(element.body, platform.body).collided;
    // Need to skip index #1 which is platform otherwise everything will be off.
    if(platformCollided && value != 0){
      blocks.push(element);
    }
  });

  physics.forEach(function (element, value) {
    // Need to skip index #1 which is platform otherwise everything will be off.
    if (collidesWithBlockList(element, blocks) && value != 0){
      blocks.push(element);
    }
  });

  if (!checkArraysEqual(stackedBlocks, blocks)){
    // If the count of stacked blocks went up lets add to our combo meter.
    if(stackedBlocks.length < blocks.length){
      staticChargeBar.add();
    }
    stackedBlocks = blocks;
    return true;
  }
  return false;
}


function collidesWithBlockList(block, list){
  for(var i=0; i<list.length; i++){
    if(Matter.SAT.collides(list[i].body, block.body).collided){
      return true;
    }
  }
  return false;
}


function updateTowerCenter(){
  let avgX = 0;
  let avgY = 0;
  // Accumulate and generate averages.
  stackedBlocks.forEach(function (element, value) {
    avgX += element.sprite.x;
    avgY += element.sprite.y;
  });
  avgX = Math.floor(avgX / stackedBlocks.length);
  avgY = Math.floor(avgY / stackedBlocks.length);
  towerCenter = {'x': avgX, 'y': avgY};

  // Update the line position.
  var normalizedY = Math.abs(avgY - (platform.sprite.y + platform.sprite.height));
  towerCenterLine.ay = -normalizedY;
  towerCenterLine.by = -normalizedY;
}


function pruneDisqualifiedBlocks(){
  let purgeList = new Array();
  // If physics object has fallen too far below then we'll stop updating it.
  physics.forEach(function (element, value) {
    // Need to skip index #1 which is platform otherwise everything will be off.
    if (element.sprite.y > platform.sprite.y + 500 && value != 0){
      soundEffects.explosions2.play();
      staticChargeBar.remove();
      World.remove(engine.world, [element.body]);
      g.remove(element.sprite);
      purgeList.push(element);
    }
  });
  physics = removeArrayElements(purgeList, physics);
}


function updatePhysicsSprites(){
  physics.forEach(function(element, value) {
    let body = element.body;
    let sprite = element.sprite;
    sprite.x = body.position.x;
    sprite.y = body.position.y;
    sprite.rotation = body.angle;

    // Apply dampening to make very bottom blocks static.
    if(stackedBlocks.length >= blockDampening && (stackedBlocks.length - blockDampening) > value){
      Matter.Body.setStatic(body, true); 
    }
  });
}


function checkWinConditions(){
  stackedBlocks.forEach(function(element) {
    //console.log(element.sprite.y, goalLine.ay + platform.sprite.y);
    // Off set from platform needs to be applied and sprite's height to be accurate.
    let spritePosition = element.sprite.y - (element.sprite.height/2);
    if (spritePosition <= goalLine.ay + platform.sprite.y){
      console.log(spritePosition);
      winnerMenu();
      g.pause();
    }
  });
}


function play() {
  updatePhysicsSprites();
  let changed = updateStackedBlocks();
  // Only run other updates if things got changed. Save some cycles.
  if (changed){
    updateTowerCenter();
    score.update();
    pruneDisqualifiedBlocks();
    checkWinConditions();
  }
  Runner.tick(runner, engine, 1000/60);
}
