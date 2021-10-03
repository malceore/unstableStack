"use strict";

const menuColor = "lightgrey";
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
  leftSprite.scaleX = leftSprite.scaleY = 0.5;
  leftSprite.x = 25;
  leftSprite.y = 5;
  menu.addChild(leftSprite);

  menu.generateNextBlock = () => {
    //shake = (sprite, magnitude = 16, angular = false)
    g.shake(leftSprite, 8);
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
  * Stack blocks to reach the RED line and 
  you win! 
  * C and V let you spawn your next block.
  * WASD let you right current block.
  * QE to rotate current block.`;
  var menu = g.rectangle(350, 200, menuColor, "black", menuLineWidth, 0, 0);
  var text = g.text(helpText, "18px puzzler", "black");
  text.y = -21;
  menu.addChild(text);

  var tag = g.rectangle(45, 25, menuColor, "black", menuLineWidth, 0, menu.height);
  tag.interact = true;
  tag.tap = () => {
    soundEffects.blip3.play();
    if(container.hidden){
      g.slide(container, container.x-150, 0, 60);
      container.hidden = false;
      help.text = "Close";
    }else{
      g.slide(container, container.x+150, -200, 60);
      container.hidden = true;
      help.text = "Help";

    }
  }

  var help = g.text("Help", "18px puzzler", "black");
  help.pivotY = 1;
  help.x = 3;
  tag.addChild(help);

  container.tag = tag;
  container.text = text;
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
    g.shake(text, 8);
    var baseScore = Math.abs(towerCenter.y - platform.sprite.y);
    text.text = "Score " + Math.max(baseScore * 10, 0);
  }
  text.reset = () => {
    //text.text = "Score " + Math.max((stackedBlocks.length - 1) * 100, 0);
    var baseScore = 0;
    text.text = "Score " + Math.max(baseScore * 10, 0);
  }
  return text;
}


function createStaticChargeBar(){
  var barBackground = g.rectangle(160, 20, menuColor, "black", menuLineWidth, 0, 0);
  var barFill = g.rectangle(20, 20, "grey", "black", menuLineWidth, 0, 0);
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
    // If full
    if(container.staticThreshold == container.staticCurrent){
      soundEffects.usedStatic.play();
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
  var closeText = g.text("Next Level", "28px puzzler", "black");
  close.addChild(closeText);
  close.setPivot(0.5);
  close.x = 100;
  close.y = 130;

  closeText.interact = true;
  closeText.tap = () => {
    soundEffects.blip3.play();
    remove(container);
    cleanUpLevel();
    currentLevel++;
    loadLevel(levels[currentLevel]);
  }

  var finalScore = g.text("Final " + score.text, "28px puzzler", "black");
  finalScore.x = 100;
  finalScore.y = 80;

  var container = g.group(menu, close, finalScore);
  g.breathe(menuText);
  g.pulse(closeText);
  g.stage.putCenter(container);
}

function resetButton(){ 
  var reset = g.rectangle(45, 25, menuColor, "black", menuLineWidth, (g.canvas.width/2 + 125), 0);
  var resetText = g.text("Reset", "18px puzzler", "black");
  resetText.x = 2;
  reset.addChild(resetText);
  reset.interact = true;
  reset.tap = () => {
    cleanUpLevel();
  }
}