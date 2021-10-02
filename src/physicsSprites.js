"use strict";
const lineWidth = 1;
const blockSize = 20;


function physicsSprite(x, y, width, height, color, mass){

  let sprite = g.rectangle(width, height, color, "black", lineWidth, x, y);
  sprite.pivotX = sprite.pivotY = 0.5;
  let body = Bodies.rectangle(x, y, width, height);
  body.mass = mass;

  return { 
    "body": body, 
    "sprite": sprite
  };
}

function physicsSpriteVerts(x, y, verts, texture, color, mass){

  let body = Matter.Bodies.fromVertices(x, y, verts);
  //body.mass = mass;
  body.mass = 0.2;
  body.friction = 1;
  body.frictionair = 0.8;
  body.frictionStatic = 1;
  /*
  // Correction for bodies here:
  /// https://github.com/liabru/matter-js/issues/211
  body.position.x = body.bounds.min.x;
  body.position.y = body.bounds.min.y;
  body.positionPrev.x = body.bounds.min.x;
  body.positionPrev.y = body.bounds.min.y; 
 let sprite = g.rectangle(10, 10, "white");
 // Draw out the lines for each complex shape.
 verts.forEach(function(element, i){
   let line;
   // Send it back home if it's done!
   if(i == verts.length-1){
     line = g.line("black", lineWidth, element.x, element.y, verts[0].x, verts[0].y);
   } else {
     line = g.line("black", 1, element.x, element.y, verts[i+1].x, verts[i+1].y);
   }
   sprite.addChild(line);
 });
 */
  //let sprite = g.rectangle(10, 10, "white");
  let sprite = g.sprite(texture);
  sprite.setPivot(0.5, 0.5);

  return { 
    "body": body, 
    "sprite": sprite
  };
}


function applyBlockSizes(verts){
  verts.forEach(element => {
    element.x = element.x * blockSize;
    element.y = element.y * blockSize;
  });
  return verts;
}


function linePiece(x, y, color, mass){
  let sprite = "res/images/lineBlock.png";
  let verts = [
    {"x": 0, "y": 0},
    {"x": 1, "y": 0},
    {"x": 1, "y": 4},
    {"x": 0, "y": 4}
  ];
  verts = applyBlockSizes(verts);
  return physicsSpriteVerts(x, y, verts, sprite, color, mass);
}


function squarePiece(x, y, color, mass){
  let sprite = "res/images/squareBlock.png";
  let verts = [
    {"x": 0, "y": 0},
    {"x": 2, "y": 0},
    {"x": 2, "y": 2},
    {"x": 0, "y": 2}
  ];
  verts = applyBlockSizes(verts);
  return physicsSpriteVerts(x, y, verts, sprite, color, mass);
}


function LPiece(x, y, color, mass){
  let sprite = "res/images/LBlock.png";
  let verts = [
    {"x": 0, "y": 0},
    {"x": 2, "y": 0},
    {"x": 2, "y": 1},
    {"x": 1, "y": 1},
    {"x": 1, "y": 3},
    {"x": 0, "y": 3},
    {"x": 0, "y": 3}
  ];
  verts = applyBlockSizes(verts);
  return physicsSpriteVerts(x, y, verts, sprite, color, mass);
}


function SPiece(x, y, color, mass){
  let sprite = "res/images/SBlock.png";
  let verts = [
    {"x": 0, "y": 0},
    {"x": 2, "y": 0},
    {"x": 2, "y": 1},
    {"x": 3, "y": 1},
    {"x": 3, "y": 2},
    {"x": 1, "y": 2},
    {"x": 1, "y": 1},
    {"x": 0, "y": 1}
  ];
  verts = applyBlockSizes(verts);
  return physicsSpriteVerts(x, y, verts, sprite, color, mass);
}


function createPlatform(){
  var platform = physicsSprite(g.canvas.width/2, g.canvas.height, 5*blockSize, 6*blockSize, "white", 50.5);
  platform.body.isStatic = true;
  return platform;
}