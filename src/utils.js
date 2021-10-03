"use strict";

function remove(container){
  container.x += 5000;
  g.remove(container);
}


function getRandomBlock(){
  let possibleBlocks = [
    () => { return linePiece(spawner.x, spawner.y, "green", 1.5)},
    //() => { return LPiece(spawner.x, spawner.y, "green", 1.5)},
    () => { return squarePiece(spawner.x, spawner.y, "green", 1.5)},
    //() => { return SPiece(spawner.x, spawner.y, "green", 1.5)}
  ];
  return possibleBlocks[g.randomInt(0, possibleBlocks.length-1)]();
}


// Given a list of elements to be removed and the array to remove them from, returns cleaned array.
function removeArrayElements(list, array){
  let replacementArray = new Array();
  array.forEach(element => {
    if(list.indexOf(element) === -1){
      replacementArray.push(element);
    }
  });
  return replacementArray;
}


function checkArraysEqual(array1, array2){
  // If not same length, return false;
  if (array1.length != array2.length){
    return false;
  } else{
    // Two sorted arrays should have the same elements.
    array1.sort();
    array2.sort();
    for(var i=0; i<array1.length; i++){
      if(array2[i] !== array1[i]){
        return false;
      }
    }
  }
  return true;
}