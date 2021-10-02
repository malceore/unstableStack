"use strict";
let resources = [
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
var engine = Engine.create({
      render: {
          element: document.body,
          controller: Matter.RenderPixi
      }
});
var runner = Runner.create();  
var spawner = g.rectangle(100, 20, "white");
var platform = createPlatform();
var towerCenter = {'x':0, 'y':0};
var scoreText;
let stackedBlocks = new Array();
var currentBlock = {};
let possibleBlocks = [
  () => { return linePiece(spawner.x, spawner.y, "green", 1.5)},
  () => { return LPiece(spawner.x, spawner.y, "green", 1.5)},
  () => { return squarePiece(spawner.x, spawner.y, "green", 1.5)},
  () => { return SPiece(spawner.x, spawner.y, "green", 1.5)}
];
g.start();

function load() {
  console.log(`loading: ${g.loadingFile}`);
  console.log(`progress: ${g.loadingProgress}`);
  g.loadingBar();
}

function setup() {
  spawner.pivotX = spawner.pivotY = 0.5;
  spawner.x = g.canvas.width/2;

  physics.push(platform);
  World.add(engine.world, [platform.body]);

  scoreText = g.text("Score: ", "18px puzzler", "white");
  //blockCount = g.text("Blocks: ", "18px puzzler", "white");

  engine.world.gravity.y = 0.2;
  console.log(engine.world.gravity.y);

  g.pointer.tap = function () {
    var block = possibleBlocks[g.randomInt(0, possibleBlocks.length-1)]();
    currentBlock = block;
    World.add(engine.world, [block.body]);
    physics.push(block);
  };

  initKeyboard();
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
      //console.log("platform touching.");
    }
  });

  physics.forEach(function (element, value) {
    // Need to skip index #1 which is platform otherwise everything will be off.
    if (collidesWithBlockList(element, blocks) && value != 0){
      blocks.push(element);
      //console.log("block touching.");
    }
  });

  stackedBlocks = blocks;
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
    if (element.sprite.y > platform.sprite.y + 50 && value != 0){
      World.remove(engine.world, [element.body]);
      purgeList.push(element);
      //console.log("block removed")
    }
  });
  physics = removeArrayElements(purgeList, physics);
}


function updatePhysicsSprites(){
  physics.forEach(element => {
    let body = element.body;
    let sprite = element.sprite;
    sprite.x = body.position.x;
    sprite.y = body.position.y;
    sprite.rotation = body.angle;
  });
}


function updateScore(){
  scoreText.text = "Score " + Math.max((stackedBlocks.length - 1) * 100, 0);
}

// Given a list of elements to be removed and the array to remove them from, returns cleaned array.
function removeArrayElements(list, array){
  let replacementArray = new Array();
  array.forEach(element => {
    if(list.indexOf(element) === -1){
      replacementArray.push(element);
    }
  });
  return replacementArray;
}


function play() {
  updatePhysicsSprites();
  updateStackedBlocks();
  updateTowerCenter();
  updateScore();
  pruneDisqualifiedBlocks();
  Runner.tick(runner, engine, 1000/60);
}
