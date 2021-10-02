function initKeyboard(){
  const blockSpeed = 1.5;
  const cameraSpeed = 25;
  let leftArrow = g.keyboard(65),
      upArrow = g.keyboard(87),
      rightArrow = g.keyboard(68),
      downArrow = g.keyboard(83),
      rotateRight = g.keyboard(69),
      rotateLeft = g.keyboard(81),
      spawnRight = g.keyboard(86),
      spawnLeft = g.keyboard(67),
      dropHard = g.keyboard(81),
      cameraLeft = g.keyboard(37),
      cameraUp = g.keyboard(38),
      cameraRight = g.keyboard(39),
      cameraDown = g.keyboard(40),
      useStatic = g.keyboard(32);

  // Combo power button.
  useStatic.press = () => {
    if (staticChargeBar.staticCurrent >= staticChargeBar.staticThreshold) {
      currentBlock.body.isStatic = true;
      g.pulse(currentBlock.sprite);
      staticChargeBar.reset();
    }
  };


  // Block spawning controls.
  spawnRight.press = () => {
    if (!spawnLeft.isDown) {
      choiceMenu.rightMenu.generateNextBlock();
    }
  };
  spawnLeft.press = () => {
    if (!spawnRight.isDown) {
      choiceMenu.leftMenu.generateNextBlock();
    }
  };


  // camera Movement
  cameraUp.press = () => {
    if (!cameraDown.isDown) {
      physics.forEach(element => {
        let newXY = {
          "x": element.body.position.x,
          "y": element.body.position.y + cameraSpeed
        };
        Matter.Body.setPosition(element.body, newXY);
      });
    }
  };
  cameraDown.press = () => {
    if (!cameraUp.isDown) {
      physics.forEach(element => {
        let newXY = {
          "x": element.body.position.x,
          "y": element.body.position.y - cameraSpeed
        };
        Matter.Body.setPosition(element.body, newXY);
      });
    }
  };


  // Block Rotation
  rotateLeft.press = () => {
    Matter.Body.rotate(currentBlock.body, -40);
  };
  rotateRight.press = () => {
    Matter.Body.rotate(currentBlock.body, 75);
    //console.log(currentBlock.body.angle);
  };

  // Block Movement
  leftArrow.press = () => {
    Matter.Body.setVelocity(currentBlock.body, { x: -blockSpeed, y: currentBlock.body.velocity.y });
  };
  leftArrow.release = () => {
    if (!rightArrow.isDown) {
      Matter.Body.setVelocity(currentBlock.body, { x: 0, y: currentBlock.body.velocity.y });
    }
  };
  rightArrow.press = () => {
    Matter.Body.setVelocity(currentBlock.body, { x: blockSpeed, y: currentBlock.body.velocity.y });
  };
  rightArrow.release = () => {
    if (!leftArrow.isDown) {
      Matter.Body.setVelocity(currentBlock.body, { x: 0, y: currentBlock.body.velocity.y });
    }
  };
  downArrow.press = () => {
    Matter.Body.setVelocity(currentBlock.body, { x: currentBlock.body.velocity.x, y: blockSpeed*2});
  };
  downArrow.release = () => {
    Matter.Body.setVelocity(currentBlock.body, { x: currentBlock.body.velocity.x, y: 0});
  };
  upArrow.press = () => {
    Matter.Body.setVelocity(currentBlock.body, { x: currentBlock.body.velocity.x, y: blockSpeed});
  };
  upArrow.release = () => {
    Matter.Body.setVelocity(currentBlock.body, { x: currentBlock.body.velocity.x, y: 0});
  };
}