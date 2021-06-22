//==============================================================================================================
//GLOBAL VARIABLES
//==============================================================================================================

var textpassword = "W2nD5!fm3?q";

var password = "";
var passwordSet = new Array();
var passwordSetCount = 0;

var inputPassword = "";
var inputPasswordSet = new Array();
var inputPasswordSetCount = 0;

var c, nx, ny, dx, dy/*, picmaxx, picmaxy*/;
var picx;
var picy;
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

var div0;
var div1;
//var div2;
//var div3;
//var div4;
//var div5;
//var div6;
//var div7;
//var div8;
//var div9;
//var div10;
//var div11;
//var div12;
//var div13;

function genPassword() {
  createCanvas();
  button0 = document.createElement("button");
  button0.innerHTML += "Show Password";
  button1 = document.createElement("button");
  button1.innerHTML += "Check Password";
  button2 = document.createElement("button");
  button2.innerHTML += "Confirm";
  div0 = document.getElementById("sub");
  div0.appendChild(button0);
  div0.appendChild(button1);
  div0.appendChild(button2);
  div0.style.display = "initial";
  document.getElementById("main").style.display = "none";
  button0.setAttribute("onclick","placeholder()");
  button1.setAttribute("onclick","placeholder()");
  button2.setAttribute("onclick","returnMain()");
}
function releasePassword() {
  div0 = document.createElement("div");
  div1 = document.getElementById("password");
  div0.innerHTML += textpassword;
  if(div1.childNodes.length === 0) {
    div1.style.display = "initial";
    div1.appendChild(div0);
    setTimeout(function(){div1.removeChild(div1.childNodes[0]);
      div1.style.display = "none"; }, 5000);
  }
}
function placeholder() {
  alert("Not implemented");
}

function createCanvas() {
  div1 = document.getElementById("canvas_container");
  div1.style.display = "initial";
  //creates canvas to draw on
  paper = Raphael(div1, 100000, 100000);
  nx = 8
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
  //    if (mode=="create") {
        tileDigits[[i,j]] = "";
        tileNumbers[[i,j]] = paper.text(i*dx+0.5*dx, j*dx+0.5*dx, "");
        tileNumbers[[i,j]].attr({'font-size': 32, fill: 'yellow'});
        tileNumbers2[[i,j]] = paper.text(i*dx+0.5*dx, j*dx+0.5*dx, "");
        tileNumbers2[[i,j]].attr({'font-size': 28, fill: 'black'});
    /*  }

      else {
        r = getRandom(0,9);
        tileDigits[[i,j]] = r+"";
        tileNumbers[[i,j]] = paper.text(i*dx+0.5*dx, j*dx+0.5*dx, r);
        tileNumbers[[i,j]].attr({'font-size': 32, fill: 'yellow'});
        tileNumbers2[[i,j]] = paper.text(i*dx+0.5*dx, j*dx+0.5*dx, r);
        tileNumbers2[[i,j]].attr({'font-size': 28, fill: 'black'});
      }
*/
      tilesquares2[[i,j]].node.onclick = new doClick([i,j]).invoke;
      tilesquares3[[i,j]].node.onclick = new doClick([i,j]).invoke;
      tileset.push(tilesquares[[i,j]]);
      tileset2.push(tilesquares2[[i,j]]);
      tileset3.push(tilesquares3[[i,j]]);
      numberSet.push(tileNumbers[[i,j]]);
      numberSet.push(tileNumbers2[[i,j]]);
    }
  }

  //putting the object recog items into their grid

  //if(div1.childNodes.length != 0) {

    tileset.show();
    tileset2.show();
    tileset3.show();

    tileset.attr({fill: allsq, stroke: allb1, 'fill-opacity': allopacity, 'stroke-opacity': 1.0, 'stroke-width': 1});
    tileset2.attr({fill: allsq, stroke: allb2, 'fill-opacity': allopacity, 'stroke-opacity': 1.0, 'stroke-width': .5});
    tileset3.attr({fill: allsq, stroke: allb1, 'fill-opacity': 0.0, 'stroke-opacity': 1.0, 'stroke-width': 0.0001});

    tileset.toFront();
    tileset2.toFront();
    tileset3.toFront();


//  }

/*  if (shuffleButton) {
    sButton = paper.rect(picminx+400, picy+5, 100, 20, 10);
    sButton.attr({fill: "lightgrey"});

    sText = paper.text(picminx+445, picy+15, "Shuffle");
    sText.attr({'font-size': 14});
    sText.node.style.cursor = "default";


    sButton.node.onclick = function() {
        recogShuffle(true);

        tileImageSet.show();
        tileImageSet.toFront();

        updateCanvas();
    }

    sText.node.onclick = sButton.node.onclick;
  }
*/

//  tileset3.attr({fill: allsq, stroke: allb1, 'fill-opacity': 0.0, 'stroke-opacity': 1.0, 'stroke-width': 0.0001});



/*  if (!digitLogin) {
    numberSet.hide();
  }
  else numberSet.show();
  */
}


function returnMain() {
  div0 = document.getElementById("sub");
  div1 = document.getElementById("canvas_container");
  while (div0.hasChildNodes()) {
    div0.removeChild(div0.lastChild);
  }
  while (div1.hasChildNodes()) {
    div1.removeChild(div1.lastChild);
  }
  div0.style.display = "none";
  div1.style.display = "none";
  document.getElementById("main").style.display = "initial"
}
