//declare global variables needed
var arrayLength = 7;
var numArray= [];
var firstClick = true;
var targetIndex;

//check the url for the sorted parameter
function isSorted() {
  var query = window.location.search.substring(1);
  var param = query.split("&");

  for(var i = 0; i < param.length; i++){
    var pair = param[i].split("=");
    if(pair[0] == "sorted") {
      return pair[1];
    }
  }

  return false;
}//end isSorted function

//store the result of the above function
var sorted = isSorted();

//function to generate the array given min and max values. start is to change the first insertion point
function generateArray(min, max, start = 0) {
  for(var i = start; i<arrayLength; i++)
  {
    var randomNum = Math.floor(Math.random() * max + 1);
    //make sure there are no repeats
    while(numArray.indexOf(randomNum) != -1 || randomNum < min) {
      randomNum = Math.floor(Math.random() * max + 1);
    }
    numArray[i] = randomNum;
  }
}//end generate array

//function to initalize the site/cards
function init(){
  //initial generation without 1 and 99 to avoid hanging
  generateArray(5, 95);
  firstClick = true;
  var cards = document.getElementById("main");
  cards.innerHTML = "<div id='searchFor' tabindex='0' autofocus></div>"

  //sort the array if the sorted variable is true
  if(sorted){
    numArray.sort(function(a, b){return a - b});
  }
  //get the html element and the index of the element to search for
  var target = document.getElementById("searchFor");
  targetIndex = Math.floor(Math.random() * arrayLength);

  //print the target number to search for
  target.innerHTML = "Target: " + numArray[targetIndex];

  for(var i = 0; i<arrayLength; i++) {
    cards.innerHTML += "<a class=\x22rectangle\x22 id=\x22" + i + "rect\x22 onclick=\x22changeColor('" + i + "rect')\x22 onkeyup=\x22callChange(event, '" + i + "rect')\x22 aria-live=\x22assertive\x22 aria-labelledby=\x22card" + (i+1) + "\x22 tabindex=\x220\x22><span hidden id=\x22card" + (i+1) + "\x22>Card " + (i+1) + " of 7</span></a>";
  }
  cards.innerHTML += "<input type='button' id='resetButton' value='Reset' onclick = 'init()' alt='Reset Button'>"
  
  document.getElementById("searchFor").focus();
}//end init function

//function that is called when block is clicked
function changeColor(rectId) {
  var rect = document.getElementById(rectId);

  var color = window.getComputedStyle(rect).backgroundColor;
  var id = parseInt(rectId);
  var spanId = "card" + (id + 1);
  //console.log(spanId);
  //console.log(targetIndex);
  //console.log(id);
  //make it impossible to pick the right number on the first try (unsorted only)
  if(firstClick == true && id == targetIndex) {
    //console.log("Found the number on first try!");
    if(sorted == false) {//values are not sorted so just swap with another value
      var swapIndex = Math.floor(Math.random() * arrayLength);
      //prevent the index of the swap target being the same as the original target
      while(swapIndex == targetIndex) {
        swapIndex = Math.floor(Math.random() * arrayLength);
      }

      var temp = numArray[targetIndex];
      numArray[targetIndex] = numArray[swapIndex];
      numArray[swapIndex] = temp;

      targetIndex = swapIndex;
    }
    else {//values are sorted so we are going to recreate the array and move it around
      //console.log("Sorted values detected");
      //store the target number to put in new array
      var targetNum = numArray[targetIndex];
      var newTargetIndex = -1;

      do {
        numArray[0] = targetNum;
        
        generateArray(1,99,1);

        numArray.sort(function(a, b){return a - b});
        newTargetIndex = numArray.indexOf(targetNum);
      } while(newTargetIndex == targetIndex);

      targetIndex = newTargetIndex;
      //console.log("Sorted array recreated. New target index at " + targetIndex);
    }//end else
  }//end firstClick if

  if(color === "rgb(0, 0, 255)" || color === "rgb(51, 204, 255)") {
    document.getElementById(rectId).style.background = "#ffffff";
    rect.innerHTML += numArray[id];
    document.getElementById(spanId).innerHTML += " is " + numArray[id];
    
  }
  
  firstClick = false;
}//end changeColor function

//function to reset the page
function resetPage() {
  init();
}//end reset function

function callChange(event, rectId) {
  var key = event.which || event.keyCode;
  if(key === 32) {
    changeColor(rectId);
  }
}

function changeFocus(event) {
  var key = event.which || event.keyCode;
  if(key === 37) {
    if(event.target.previousElementSibling == null){
      document.getElementById("resetButton").focus();
    }
    else {
      event.target.previousElementSibling.focus();
    }
  }
  else if(key === 39) {
    if(event.target.nextElementSibling == null) {
      document.getElementById("searchFor").focus();
    }
    else {
      event.target.nextElementSibling.focus();
    }
  }
  else if(key === 38) {
    if(event.target.className == "rectangle") {
      document.getElementById("resetButton").focus();
    }
    else if(event.target.previousElementSibling == null) {
      document.getElementById("0rect").focus();
    }
    else {
      document.getElementById("searchFor").focus();
    }
  }
  else if(key === 40) {
    if(event.target.nextElementSibling == null) {
      document.getElementById("0rect").focus();
    }
    else if(event.target.className == "rectangle") {
      document.getElementById("searchFor").focus();
    }
    else {
      document.getElementById("resetButton").focus();
    }
  }
}
