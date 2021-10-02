"use strict";
const resources = [
  "res/images/LBlock.png",
  "res/images/lineBlock.png",
  "res/images/SBlock.png",
  "res/images/squareBlock.png"
];
var g = hexi(500, 520, setup, resources, load);
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
var spawner = createSpawner();
var platform = createPlatform();
var staticChargeBar = createStaticChargeBar();
var towerCenter = {'x':0, 'y':0};
var choiceMenu;
var blockDampening = 6;
let stackedBlocks = new Array();
var score = createScore();
var currentBlock = {};
g.start();

function load() {
  console.log(`loading: ${g.loadingFile}`);
  console.log(`progress: ${g.loadingProgress}`);
  g.loadingBar();
}

function setup() {
  physics.push(platform);
  World.add(engine.world, [platform.body]);
  engine.world.gravity.y = 0.09;
  choiceMenu = choiceMenu();
  initKeyboard();
  helpMenu();
  g.state = play;
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
}


function pruneDisqualifiedBlocks(){
  let purgeList = new Array();
  // If physics object has fallen too far below then we'll stop updating it.
  physics.forEach(function (element, value) {
    // Need to skip index #1 which is platform otherwise everything will be off.
    if (element.sprite.y > platform.sprite.y + 1500 && value != 0){
      World.remove(engine.world, [element.body]);
      purgeList.push(element);
    }
     // If blocks fell of let's sour the combo.
    if (element.sprite.y > platform.sprite.y + 100 && value != 0){
      staticChargeBar.remove();
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
      body.isStatic = true;
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
  }
  Runner.tick(runner, engine, 1000/60);
}
