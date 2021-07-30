//==============================================================================================================
//GLOBAL VARIABLES
//==============================================================================================================

var numSet = new Array();

var password = "";
var temp;
var passwordSet = new Array();
var passwordSetCount = 0;

var inputPassword = "";
var inputPasswordSet = new Array();
var inputPasswordSetCount = 0;

var c, nx, ny, dx, dy/*, picmaxx, picmaxy*/;
var picx;
var picy;

var az = "1!2@3#4$5%6^7&8*9?AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYy";


var paper;
var imageDir = ".."

var picfile;
var picname;
var filename;

var filePos;
var tileFiles;
var tileImages;
var tileImageSet;


var numClicks = 5;

var tileset = null;
var tileset2 = null;
var tileset3 = null;

var button0;
var button1;
var button2;

var allsq = "black";
var allb1 = "black";
var allb2 = "white";

var pwdsq = "yellow";
var pwdb1 = "yellow";
var pwdb2 = "red";

var allopacity = 0.0;

var showp = false;
var choosingPic = false;
var choosingPwd = false;
var mode;

var div0;
var div1;

function genPassword() {
  mode = "create";
  showp = true;
  passwordSetCount = 0;
  password = "";
  passwordSet = new Array();
  while (passwordSetCount < numClicks) {
    temp = [getRandom(0,9),getRandom(0,7)];
    for (var i = 0; i < passwordSetCount; i++) {
      if(passwordSet[i] == temp) {
        temp = null;
        break;
      }
    }
    if(temp != null) {
      passwordSet[passwordSetCount] = temp;
      numSet[passwordSetCount] = [getRandom(0,67 - passwordSet[passwordSetCount][0]), getRandom(0,67 - passwordSet[passwordSetCount][1])]
      passwordSetCount ++;
    }
  }
  passwordSet.sort();
  for (var i = 0; i < passwordSetCount; i++)   password += az.substr(passwordSet[i][0]+numSet[i][0],1) + az.substr(passwordSet[i][1]+numSet[i][1],1);
  if (tileset != null)   tileset = paper.clear();
  if (tileset2 != null)   tileset2 = paper.clear();
  if (tileset3 != null)   tileset3 = paper.clear();
  createCanvas();
  updateCanvas();
  button0 = document.createElement("button");
  button0.innerHTML += "Hide Password";
  button1 = document.createElement("button");
  button1.innerHTML += "Confirm";
  div0 = document.getElementById("button_div");
  div0.appendChild(button0);
  div0.appendChild(button1);
  div0.style.display = "initial";
  document.getElementById("main").style.display = "none";
  button0.setAttribute("onclick","hidePassword()");
  button1.setAttribute("onclick","returnMain()");
}

function releasePassword() {
  mode = "enter";
  showp = false;
  createCanvas();
  button1 = document.createElement("button");
  button1.innerHTML += "Go Back";
  div0 = document.getElementById("button_div");
  div0.appendChild(button1);
  div0.style.display = "initial";
  document.getElementById("main").style.display = "none";
  button1.setAttribute("onclick","returnMain()");
}

function hidePassword() {
  showp = false;
  button0.innerHTML = "Show Password";
  button0.setAttribute("onclick", "showPassword()");
  updateCanvas();
}

function showPassword() {
  showp = true;
  button0.innerHTML = "Hide Password";
  button0.setAttribute("onclick", "hidePassword()");
  updateCanvas();
}

function getRandom(min, max) {
    var randomNum = Math.random() * (max-min);
    return(Math.round(randomNum) + min);
}

function doClick(coords) {
    this.ij = coords;
    var current = this;
    this.invoke = function () {

	if (choosingPic) return;
	if (inputPasswordSetCount >= numClicks) return;

	i = current.ij[0];
	j = current.ij[1];


	inputPasswordSet[inputPasswordSetCount] = [i,j];
	inputPasswordSetCount ++;

	updateCanvas();
	updateCanvas2();
    }

  }

  function inInputPassword(coords) {
      for (var k=0; k<inputPasswordSetCount; k++) {
  	if (inputPasswordSet[k][0]==coords[0] && inputPasswordSet[k][1]==coords[1]) return true;
      }
      return false;
  }

function createCanvas() {
  div1 = document.getElementById("canvas_container");
  div1.style.display = "initial";
  //creates canvas to draw on
  paper = Raphael(div1, 2000, 2000);
  nx = 10
  ny = 8
  dx = 1152/nx;
  dy = 648/ny;
  //gets path for image
  picfile = imageDir + "/blankPic.jpg";
  picname = "blankPic.jpg";

  filePos = Array();
  tilePos =  Array();
  tileImages = Array();
  tileImageSet = paper.set();
  passwordFileNames = Array();

  //This draws the image on the canvas
  picture = paper.image(picfile, 1, 1, 1152, 648 );
  //This draws the text click-counter
  clickCounter = paper.text(1, 1+10, "Remaining Clicks: "+numClicks);
  clickCounter.attr({'text-anchor': "start",'font-size': 14});

  //This draws the clear button
  button = paper.rect(1+300, 1+5, 100, 20, 10);
  button.attr({fill: "lightgrey"});

  clear = paper.text(1+350, 1+15, "Clear");
  clear.attr({'font-size': 14});
  //	clear.toFront();
  clear.node.style.cursor = "default";


  button.node.onclick = function() {
//		traceit("are we here?");
    clearPassword();
    updateCanvas();
  }

  clear.node.onclick = button.node.onclick;


  //This draws the line connecting the circles in the visual click-counter
  var line = paper.path("M7 430L117 430");
  line.hide();
  //	line.toBack();

  //This draws the circles in the visual click-counter
  circles = Array();

  for (var i=0; i<numClicks; i++) {
    circles[i] = paper.circle(1+25*i+2,1+30,10);
    circles[i].attr({fill: "orange"});
  }

  clickCounter.hide();
  button.hide();
  clear.hide();
  for (var i=0; i<numClicks; i++) {
    circles[i].hide();
  }
  line.hide();


  //This draws the grid over the password image and ties it to the clicks

  //tileset
  tileset = paper.set();
  tileset2 = paper.set();
  tileset3 = paper.set();
  tilesquares = Array();
  tilesquares2 = Array();
  tilesquares3 = Array();

  numberSet = paper.set();
  tileNumbers = Array();
  tileNumbers2 = Array();
  tileDigits = Array();


  for (var i = 0; i < nx; i++) {
    for (var j = 0; j < ny; j++) {
      tilesquares[[i,j]] = paper.rect(i*dx+3,j*dy+3,dx-6,dy-6);
      tilesquares2[[i,j]] = paper.rect(i*dx+3,j*dy+3,dx-6,dy-6);
      tilesquares3[[i,j]] = paper.rect(i*dx,j*dy,dx,dy);
      if (mode=="create") {
        tileDigits[[i,j]] = "";
        tileNumbers[[i,j]] = paper.text(i*dx+0.5*dx, j*dx+0.5*dx, "");
        tileNumbers[[i,j]].attr({'font-size': 32, fill: 'yellow'});
        tileNumbers2[[i,j]] = paper.text(i*dx+0.5*dx, j*dx+0.5*dx, "");
        tileNumbers2[[i,j]].attr({'font-size': 28, fill: 'black'});
      }

      else {
        r = getRandom(0,9);
        tileDigits[[i,j]] = r+"";
        tileNumbers[[i,j]] = paper.text(i*dx+0.5*dx, j*dx+0.5*dx, r);
        tileNumbers[[i,j]].attr({'font-size': 32, fill: 'yellow'});
        tileNumbers2[[i,j]] = paper.text(i*dx+0.5*dx, j*dx+0.5*dx, r);
        tileNumbers2[[i,j]].attr({'font-size': 28, fill: 'black'});
      }

      tilesquares2[[i,j]].node.onclick = new doClick([i,j]).invoke;
      tilesquares3[[i,j]].node.onclick = new doClick([i,j]).invoke;
      tileset.push(tilesquares[[i,j]]);
      tileset2.push(tilesquares2[[i,j]]);
      tileset3.push(tilesquares3[[i,j]]);
      numberSet.push(tileNumbers[[i,j]]);
      numberSet.push(tileNumbers2[[i,j]]);
    }
  }

    tileset.show();
    tileset2.show();
    tileset3.show();

    tileset.attr({fill: allsq, stroke: allb1, 'fill-opacity': allopacity, 'stroke-opacity': 1.0, 'stroke-width': 1});
    tileset2.attr({fill: allsq, stroke: allb2, 'fill-opacity': allopacity, 'stroke-opacity': 1.0, 'stroke-width': .5});
    tileset3.attr({fill: allsq, stroke: allb1, 'fill-opacity': 0.0, 'stroke-opacity': 1.0, 'stroke-width': 0.0001});

    tileset.toFront();
    tileset2.toFront();
    tileset3.toFront();


    tileset3.attr({fill: allsq, stroke: allb1, 'fill-opacity': 0.0, 'stroke-opacity': 1.0, 'stroke-width': 0.0001});

    numberSet.hide();
    updateCanvas();
}

function enterPassword() {
  div0 = document.createElement("div");
  div1 = document.getElementById("password");
  inputPassword = "";
  for (var i = 0; i < inputPasswordSetCount; i++)   inputPassword += az.substr(inputPasswordSet[i][0]+numSet[i][0],1) + az.substr(inputPasswordSet[i][1]+numSet[i][1],1);


    inputPassword = "";

    inputPasswordSet.sort();


	for (var i = 0; i < inputPasswordSetCount; i++)   inputPassword += az.substr(inputPasswordSet[i][0]+numSet[i][0],1) + az.substr(inputPasswordSet[i][1]+numSet[i][1],1);

    if (mode=="create") {
	     if (inputPassword == password) {

		div0.innerHTML = "Yay! You correctly entered your password!";


	}
	else { // inputPassword != password
	    div0.innerHTML = "Oops, try again! ";

		}

  while(div1.childNodes.length != 0) {
    div1.removeChild(div1.lastChild);
  }
  div1.style.display = "initial";
  div1.appendChild(div0);
	inputPasswordSet = Array();
	inputPasswordSetCount = 0;
	updateCanvas();

    }

    else { //mode is enter
	if (inputPassword == password) {
   div0.innerHTML = inputPassword;
   while(div1.childNodes.length != 0) {
     div1.removeChild(div1.lastChild);
   }
   div1.style.display = "initial";
   div1.appendChild(div0);

  }
	else {
     div0.innerHTML = "Password is incorrect";
     while(div1.childNodes.length != 0) {
       div1.removeChild(div1.lastChild);
     }
     div1.style.display = "initial";
     div1.appendChild(div0);

  }

    }
}


function updateCanvas2() {

    if (inputPasswordSetCount==numClicks) {
	if (mode=="create" && choosingPwd) {
	    $.prompt("Click 'Accept Password' to choose this password, or 'Clear' to select another. ");

	}
	else enterPassword();

    }

    updateCanvas();
}

function updateCanvas() {


    if (mode=="create") {


    console.log(picfile);
    picture = paper.image(picfile, 1, 1, picx, picy);

    if (showp) allopacity = 0.1;
    else allopacity = 0.0;


    if (choosingPic) {
	    tileset.hide();
    	tileset2.hide();
      tileset3.hide();

    }
    else {
	   tileset.show();
	   tileset2.show();
	   tileset3.show();
    }

    tileset.attr({fill: allsq, stroke: allb1, 'fill-opacity': allopacity, 'stroke-opacity': 1.0, 'stroke-width': 1});
    tileset2.attr({fill: allsq, stroke: allb2, 'fill-opacity': allopacity, 'stroke-opacity': 1.0, 'stroke-width': .5});
    tileset.toFront();

    tileset2.toFront();
    tileset3.toFront();
    numberSet.toFront();


    if (showp) {

	numberSet.attr({text:""});

	for (var i=0; i<passwordSetCount; i++) {
	    tilesquares[passwordSet[i]].attr({fill: pwdsq, stroke: pwdb1, 'fill-opacity': 0.0, 'stroke-opacity': 1.0, 'stroke-width': 7});
	    tilesquares2[passwordSet[i]].attr({fill: pwdsq, stroke: pwdb2, 'fill-opacity': 0.0, 'stroke-opacity': 1.0, 'stroke-width': 3});
	    tileNumbers[passwordSet[i]].attr({text: i+1})
	    tileNumbers2[passwordSet[i]].attr({text: i+1})
	    tilesquares[passwordSet[i]].toFront();;
	    tilesquares2[passwordSet[i]].toFront();
	    tileNumbers[passwordSet[i]].toFront();
	    tileNumbers2[passwordSet[i]].toFront();
	    tilesquares3[passwordSet[i]].toFront();
	}

	  }
  for (var i=0; i<inputPasswordSetCount; i++) {
	    tilesquares[inputPasswordSet[i]].attr({fill: pwdsq, stroke: "blue", 'fill-opacity': 0.0, 'stroke-opacity': 1.0, 'stroke-width': 7});
	    tilesquares2[inputPasswordSet[i]].attr({fill: pwdsq, stroke: "limegreen", 'fill-opacity': 0.0, 'stroke-opacity': 1.0, 'stroke-width': 3});

	    tilesquares[inputPasswordSet[i]].toFront();
	    tilesquares2[inputPasswordSet[i]].toFront();
	    tileNumbers[inputPasswordSet[i]].toFront();
	    tileNumbers2[inputPasswordSet[i]].toFront();
	    tilesquares3[inputPasswordSet[i]].toFront();
	}

}


function returnMain() {
  div0 = document.getElementById("button_div");
  div1 = document.getElementById("canvas_container");
  div2 = document.getElementById("password");
  while (div0.hasChildNodes()) {
    div0.removeChild(div0.lastChild);
  }
  while (div1.hasChildNodes()) {
    div1.removeChild(div1.lastChild);
  }
  while (div2.hasChildNodes()) {
    div2.removeChild(div2.lastChild);
  }
  div0.style.display = "none";
  div1.style.display = "none";
  div2.style.display = "none";
  document.getElementById("main").style.display = "initial"
}
