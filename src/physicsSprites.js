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
  body.mass = 0.9;
  body.friction = 1;
  body.frictionair = 0.8;
  body.frictionStatic = 1;

  var polys = new Array();
  verts.forEach(function(element, i){
    polys.push(element.x, element.y);
  });
  var ge = new PIXI.Graphics();
  ge.beginFill("white");
  ge.drawPolygon(polys);
  ge.endFill();

  let sprite = g.sprite(texture);

  sprite.addChild(ge);
  ge.x -= sprite.width/2;
  ge.y -= sprite.height/2;
  sprite.setPivot(0.5, 0.5);
  //Start it off screen until used..
  sprite.position.x = -500;

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

function createSpawner(){
  var spawner = g.rectangle(100, 20, "white");
  spawner.pivotX = spawner.pivotY = 0.5;
  spawner.x = g.canvas.width/2;
  spawner.y = -35;
  spawner.visible = false;
  return spawner;
}