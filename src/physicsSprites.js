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


function LinePiece(){

}