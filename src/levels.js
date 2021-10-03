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
  Matter.Body.setPosition(platform.body, {'x':platform.body.position.x, 'y': g.canvas.height});
  // Dunno why the prgrammatic way wasn't working so here's a magic number based on.
  //    -((background.height - g.canvas.height) - 500);
  background.y = -4980;
}


levels = [{
  winConditionHeight: -80,
  id: 1,
  name: "level 1",
  help: `
  How to:
  * Stack blocks to reach the RED line and 
  you win! 
  * C and V let you spawn your next block.
  * WASD let you right current block.
  * QE to rotate current block`,
  obstacles: [],
  pieces: []

},{
  winConditionHeight: -400,
  id: 2,
  name: "level 2",
  help: `
  How To:
  * Fill your combo bar by stacking 8 blocks.
  * When the bar on the left is filled you 
  can FREEZE your current block in midair 
  by pressing SPACE.
  * ARROW UP and DOWN let you move 
  the camera up and down the tower.
  `,
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
},{
  winConditionHeight: -3200,
  id: 6,
  name: "level 6",
  obstacles: [],
  pieces: []

},{
  winConditionHeight: -4000,
  id: 7,
  name: "level 7",
  obstacles: [],
  pieces: []

},{
  winConditionHeight: -5000,
  id: 8,
  name: "level 8",
  obstacles: [],
  pieces: []

}];