"use strict";
var g = hexi(500, 520, setup);
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
spawner.pivotX = spawner.pivotY = 0.5;
spawner.x = g.canvas.width/2;

let possibleBlocks = [
  () => { return linePiece(spawner.x, spawner.y, "green", 1.5)},
  () => { return LPiece(spawner.x, spawner.y, "green", 1.5)},
  () => { return squarePiece(spawner.x, spawner.y, "green", 1.5)},
  () => { return SPiece(spawner.x, spawner.y, "green", 1.5)}
];
g.start();


function setup() {
  var platform = createPlatform();
  physics.push(platform);
  World.add(engine.world, [platform.body]);
  g.pointer.tap = function () {
    var block = possibleBlocks[g.randomInt(0, possibleBlocks.length-1)]();
    World.add(engine.world, [block.body]);
    physics.push(block);
  };
  g.state = play;
}


function play() {
  
  physics.forEach(element => {
    let body = element.body;
    let sprite = element.sprite;
    sprite.x = body.position.x;
    sprite.y = body.position.y;
    sprite.rotation = body.angle;
  });
  
  Runner.tick(runner, engine, 1000/60);
  
}
