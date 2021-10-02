"use strict";

const menuColor = "white";
const menuLineWidth = 1;

function choiceMenu(){
  const container = g.group();
  // Take into account container width.
  container.leftMenu = createSelectMenu("C");
  container.addChild(container.leftMenu);
  container.rightMenu = createSelectMenu("V");
  container.rightMenu.x = container.rightMenu.width;
  container.addChild(container.rightMenu);
  container.x = g.canvas.width/2 - container.leftMenu.width;
  return container;
}


function createSelectMenu(char){
  const menu = g.rectangle(80, 50, menuColor, "black", menuLineWidth, 0, 0);
  var leftText = g.text(char, "18px puzzler", "black");
  leftText.pivotY = 1;
  leftText.position.y = menu.height;
  leftText.position.x = 2;
  menu.addChild(leftText);
  menu.previewBlock = getRandomBlock();
  var leftSprite = g.sprite(menu.previewBlock.sprite.texture);
  leftSprite.scale.x = leftSprite.scale.y = 0.5;
  leftSprite.x = 25;
  leftSprite.y = 5;
  menu.addChild(leftSprite);

  menu.generateNextBlock = () => {
    // First we push the preview into active.
    var previewBlock = menu.previewBlock;
    currentBlock = previewBlock;
    World.add(engine.world, [previewBlock.body]);
    physics.push(previewBlock);
    // Then we make a new one and update preview.
    menu.previewBlock = getRandomBlock();
    leftSprite.texture = menu.previewBlock.sprite.texture;
  }

  return menu;
}


function helpMenu(){
  var container = g.group();
  container.x = g.canvas.width/2 + 80;
  container.y = -200;
  container.hidden = true;

  const helpText = `
  How to:
  * Stack blocks to reach the red line and 
  you win! 
  * C and V let you select your next block.
  * WASD let you right current block.
  * QE to rotate current block.
  * Arrow keys let you move the camera up 
  and down the tower.
  * When the bar is filled you can make any 
  block stick where you want using space.

  `;
  var menu = g.rectangle(350, 200, menuColor, "black", menuLineWidth, 0, 0);
  var text = g.text(helpText, "18px puzzler", "black");
  text.y = -21;
  menu.addChild(text);

  var tag = g.rectangle(42, 25, menuColor, "black", menuLineWidth, 0, menu.height);
  tag.interact = true;
  tag.tap = () => {
    if(container.hidden){
      g.slide(container, container.x-150, 0, 60);
      container.hidden = false;
    }else{
      g.slide(container, container.x+150, -200, 60);
      container.hidden = true;
    }
  }

  var help = g.text("Help", "18px puzzler", "black");
  help.pivotY = 1;
  help.x = 3;
  tag.addChild(help);

  container.addChild(menu);
  container.addChild(tag);
  return container;
}


function createScore(){
  var text = g.text("Score: 0", "18px puzzler", "white");
  text.x = 5;
  text.y = 25;
  text.update = () => {
    //text.text = "Score " + Math.max((stackedBlocks.length - 1) * 100, 0);
    var baseScore = Math.abs(towerCenter.y - platform.sprite.y);
    text.text = "Score " + Math.max(baseScore * 10, 0);
  }
  return text;
}


function createStaticChargeBar(){
  var barBackground = g.rectangle(160, 20, menuColor, "black", menuLineWidth, 0, 0);
  var barFill = g.rectangle(20, 20, "lightgrey", "black", menuLineWidth, 0, 0);
  const container = g.group(barBackground, barFill);
  container.barFill = barFill;
  container.x = 2;
  container.y = 2
  container.staticThreshold = 8;
  container.staticCurrent = 1;
  container.update = () => {
    container.barFill.width = 20 * container.staticCurrent;
  }
  container.add = () => {
    // Above threhold don'tupdate any further.
    if (container.staticThreshold > container.staticCurrent){
      container.staticCurrent++;
      container.update();
    }
  }
  container.remove = () => {
    // If it would go negative don't do anything.
    if (container.staticCurrent != 0){
      container.staticCurrent--;
      container.update();
    }
  }
  container.reset = () => {
    container.staticCurrent=0;
    container.update();
  }

  return container;
}


function winnerMenu(){
  var menu = g.rectangle(350, 200, menuColor, "black", menuLineWidth, 0, 0);
  var menuText = g.text("You won!", "48px puzzler", "black");
  menuText.x = 50;
  menuText.y = 10;
  menu.addChild(menuText);

  var close = g.rectangle(50, 30, menuColor, "black", 10, 0, 0);
  // Later this will be return to menu!
  var closeText = g.text("Close", "28px puzzler", "black");
  close.addChild(closeText);
  close.setPivot(0.5);
  close.x = 100;
  close.y = 130;

  closeText.interact = true;
  closeText.tap = () => {
    container.x += 5000;
    close.interact = false;
    g.remove(container);
    //g.resume();
  }

  var finalScore = g.text("Final " + score.text, "28px puzzler", "black");
  finalScore.x = 100;
  finalScore.y = 80;

  var container = g.group(menu, close, finalScore);
  g.stage.putCenter(container);
}