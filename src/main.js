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
var currentBlock = {};
let possibleBlocks = [
  () => { return linePiece(spawner.x, spawner.y, "green", 1.5)},
  () => { return LPiece(spawner.x, spawner.y, "green", 1.5)},
  () => { return squarePiece(spawner.x, spawner.y, "green", 1.5)},
  () => { return SPiece(spawner.x, spawner.y, "green", 1.5)}
];
g.start();


function load() {
  //Display the file currently being loaded
  console.log(`loading: ${g.loadingFile}`);
  //Display the percentage of files currently loaded
  console.log(`progress: ${g.loadingProgress}`);
  g.loadingBar();
}

function setup() {
  spawner.pivotX = spawner.pivotY = 0.5;
  spawner.x = g.canvas.width/2;

  var platform = createPlatform();
  physics.push(platform);
  World.add(engine.world, [platform.body]);

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


function play() {
  
  physics.forEach(element => {
    let body = element.body;
    let sprite = element.sprite;
    sprite.x = body.position.x;
    sprite.y = body.position.y;
    sprite.rotation = body.angle;
    //console.log(body.velocity);
  });

  Runner.tick(runner, engine, 1000/60);
}
