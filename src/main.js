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
g.start();


function setup() {
  var platform = physicsSprite(g.canvas.width/2, g.canvas.height, 100, 120, "white", 0.5);
  platform.body.isStatic = true;
  console.log(platform.sprite.x);
  physics.push(platform);
  World.add(engine.world, [platform.body]);
  
  var spawner = g.rectangle(100, 20, "white");
  spawner.pivotX = spawner.pivotY = 0.5;
  spawner.x = g.canvas.width/2;

  g.pointer.tap = function () {
    var block = physicsSprite(spawner.x, spawner.y, 20, 20, "green", 0.5);
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
