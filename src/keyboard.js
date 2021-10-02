function initKeyboard(){
  const speed = 1.5;
  let leftArrow = g.keyboard(65),
      upArrow = g.keyboard(38),
      rightArrow = g.keyboard(68),
      downArrow = g.keyboard(83),
      rotateRight = g.keyboard(69),
      rotateLeft = g.keyboard(81),
      spawnRight = g.keyboard(69),
      spawnLeft = g.keyboard(81),
      dropHard = g.keyboard(81);


  dropHard.press = () => {
    Matter.Body.rotate(currentBlock.body, 75);
    console.log(currentBlock.body.angle);
  };

  // Block Rotation
  rotateLeft.press = () => {
    Matter.Body.rotate(currentBlock.body, -40);
  };
  rotateRight.press = () => {
    Matter.Body.rotate(currentBlock.body, 75);
    console.log(currentBlock.body.angle);
  };

  // Block Movement
  leftArrow.press = () => {
    Matter.Body.setVelocity(currentBlock.body, { x: -speed, y: currentBlock.body.velocity.y });
  };
  leftArrow.release = () => {
    if (!rightArrow.isDown) {
      Matter.Body.setVelocity(currentBlock.body, { x: 0, y: currentBlock.body.velocity.y });
    }
  };
  rightArrow.press = () => {
    Matter.Body.setVelocity(currentBlock.body, { x: speed, y: currentBlock.body.velocity.y });
  };
  rightArrow.release = () => {
    if (!leftArrow.isDown) {
      Matter.Body.setVelocity(currentBlock.body, { x: 0, y: currentBlock.body.velocity.y });
    }
  };
  downArrow.press = () => {
    Matter.Body.setVelocity(currentBlock.body, { x: currentBlock.body.velocity.x, y: speed});
  };
  downArrow.release = () => {
    Matter.Body.setVelocity(currentBlock.body, { x: currentBlock.body.velocity.x, y: 0});
  };
}