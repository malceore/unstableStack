function cleanUpLevel(){
  // Reset score, static combo values, stacked count and update center.
  score.reset();
  staticChargeBar.reset();
  stackedBlocks = new Array();
  updateTowerCenter();

  // Now to reset blocks bodies and sprites
  let newPhysics = new Array();
  for(var i=0; i<physics.length; i++){
    if(i != 0){
      g.remove(physics[i].sprite);
      World.remove(engine.world, [physics[i].body]);
    } else {
      newPhysics.push(physics[i]);
    }
  }
  physics = newPhysics;
  // Reset 'camera'
  Matter.Body.setPosition(platform.body, {'x':platform.body.position.x, 'y': g.canvas.height})
  //background.y -= (background.height - g.canvas.height) - 500;
}

levels = [{
  winConditionHeight: -100,
  id: 1,
  name: "level 1",
  obstacles: [],
  pieces: []

},{
  winConditionHeight: -400,
  id: 2,
  name: "level 2",
  obstacles: [],
  pieces: []

},{
  winConditionHeight: -800,
  id: 3,
  name: "level 3",
  obstacles: [],
  pieces: []

},{
  winConditionHeight: -1600,
  id: 4,
  name: "level 4",
  obstacles: [],
  pieces: []

},{
  winConditionHeight: -2400,
  id: 5,
  name: "level 5",
  obstacles: [],
  pieces: []

}];