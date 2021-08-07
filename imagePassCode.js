//==============================================================================================================
//GLOBAL VARIABLES
//==============================================================================================================
var url;

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

var az = "1a2b3c4d5e6f7g8h9ijklmnopqrstuvwxy";
var za = "A!B@C#D$E%F^G&H*I?JKLMNOPQRSTUVWXY";

var paper;

var picfile;

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

var xhttp;

function genPassword() {
  url = '';
  picfile = '';
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    url = tabs[0].url;
  });
  returnMain();
  mode = "create";
  showp = true;
  passwordSetCount = 0;
  password = "";
  passwordSet = new Array();
  while (passwordSetCount < numClicks) {
    temp = [getRandom(0,7),getRandom(0,5)];
    for (var i = 0; i < passwordSetCount; i++) {
      if(passwordSet[i] == temp) {
        temp = null;
        break;
      }
    }
    if(temp != null) {
      passwordSet[passwordSetCount] = temp;
      passwordSetCount ++;
    }
  }
  passwordSet.sort();
  for (var i = 0; i < passwordSetCount; i++)   password += az.substr(passwordSet[i][0],1) + za.substr(passwordSet[i][1],1);
  if (tileset != null)   tileset = paper.clear();
  if (tileset2 != null)   tileset2 = paper.clear();
  if (tileset3 != null)   tileset3 = paper.clear();
  createCanvas();
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
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    url = tabs[0].url;
  });
  setTimeout(function() {picfile = '';
    returnMain();
    mode = "enter";
    showp = false;
    button1 = document.createElement("button");
    button1.innerHTML += "Go Back";
    div0 = document.getElementById("button_div");
    div0.appendChild(button1);
    document.getElementById("main").style.display = "none";
    button1.setAttribute("onclick","returnMain()");
    div0.style.display = "initial";
    if (tileset != null)   tileset = paper.clear();
    if (tileset2 != null)   tileset2 = paper.clear();
    if (tileset3 != null)   tileset3 = paper.clear();
    createCanvas();
  }, 250);

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

async function createCanvas() {

  div1 = document.getElementById("canvas_container");
  div1.style.display = "initial";
  let img;
  let imageLoadPromise = new Promise(resolve => {
    if (mode == "create") {
      //Creates HttpRequest to get new random image
      getPicture(function() {
        picfile = this.responseText;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              div0 = document.getElementById("password");
              div0.style.display = "initial";
              div0.innerHTML = "Password Saved!"
          }
          else {
            div0 = document.getElementById("password");
            div0.style.display = "initial";
            div0.innerHTML = "Failed to save password.";
          }
        }
        let data = {};
        data.url = url;
        data.image = picfile;
        data.password = password;
        xhr.open("POST", "http://localhost:3000/addPassword",true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(data));
        img = new Image();
        img.onload = resolve;
        img.src = picfile;
      });
    } else { //mode is enter
      // Creates HttpRequest to get password url
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (this.status == 404) {
          div0 = document.getElementById("password");
          div0.style.display = "initial";
          div0.innerHTML = "Password not found.";
        }
        else {
          setTimeout(function() {
            let info = JSON.parse(xhr.responseText);
              picfile = info.image;
              div0 = document.getElementById("password");
              div0.style.display = "initial";
              password = info.password;
              div0.innerHTML = "Password loaded.";
              img = new Image();
              img.onload = resolve;
              img.src = picfile;
            }, 250)
        }
      }
        let data = {};
        data.url = url;
        xhr.open("POST", "http://localhost:3000/password",true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(data));
      }
});
  await imageLoadPromise;
  picx = img.width;
  picy = img.height;
  nx = 8
  ny = 6
  dx = picx/nx;
  dy = picy/ny;
  paper = Raphael(div1, picx+10, picy+10);
  filePos = Array();
  tilePos =  Array();
  tileImages = Array();
  tileImageSet = paper.set();
  passwordFileNames = Array();

  picture = paper.image(picfile, 1, 1, picx, picy);

  //This draws the grid over the password image and ties it to the clicks

  //tileset
  tileset = paper.set();
  tileset2 = paper.set();
  tileset3 = paper.set();
  tilesquares = Array();
  tilesquares2 = Array();
  tilesquares3 = Array();

  for (var i = 0; i < nx; i++) {
    for (var j = 0; j < ny; j++) {
      tilesquares[[i,j]] = paper.rect(i*dx+3,j*dy+3,dx-6,dy-6);
      tilesquares2[[i,j]] = paper.rect(i*dx+3,j*dy+3,dx-6,dy-6);
      tilesquares3[[i,j]] = paper.rect(i*dx,j*dy,dx,dy);

      tilesquares2[[i,j]].node.onclick = new doClick([i,j]).invoke;
      tilesquares3[[i,j]].node.onclick = new doClick([i,j]).invoke;
      tileset.push(tilesquares[[i,j]]);
      tileset2.push(tilesquares2[[i,j]]);
      tileset3.push(tilesquares3[[i,j]]);
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

  updateCanvas();
}

function enterPassword() {
  div0 = document.createElement("div");
  div1 = document.getElementById("password");
  inputPassword = "";
  for (var i = 0; i < inputPasswordSetCount; i++)   inputPassword += az.substr(inputPasswordSet[i][0],1) + za.substr(inputPasswordSet[i][1],1);

    inputPassword = "";
    inputPasswordSet.sort();

  for (var i = 0; i < inputPasswordSetCount; i++)   inputPassword += az.substr(inputPasswordSet[i][0],1) + za.substr(inputPasswordSet[i][1],1);
    if (mode=="create") {
      if (inputPassword == password) {
        div0.innerHTML = "Correct! New text password is: " + inputPassword;
      }
      else { // inputPassword != password
        div0.innerHTML = "Incorrect, please try again. ";

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
    inputPasswordSet = Array();
    inputPasswordSetCount = 0;
    updateCanvas();
  }
}


function updateCanvas2() {

  if (inputPasswordSetCount==numClicks) {
     enterPassword();

  }
  updateCanvas();
}

function updateCanvas() {

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
  //numberSet.toFront();


  if (showp) {

    //numberSet.attr({text:""});

    for (var i=0; i<passwordSetCount; i++) {
        tilesquares[passwordSet[i]].attr({fill: pwdsq, stroke: pwdb1, 'fill-opacity': 0.0, 'stroke-opacity': 1.0, 'stroke-width': 7});
        tilesquares2[passwordSet[i]].attr({fill: pwdsq, stroke: pwdb2, 'fill-opacity': 0.0, 'stroke-opacity': 1.0, 'stroke-width': 3});
      /*  tileNumbers[passwordSet[i]].attr({text: i+1})
        tileNumbers2[passwordSet[i]].attr({text: i+1})*/
        tilesquares[passwordSet[i]].toFront();;
        tilesquares2[passwordSet[i]].toFront();
      /*  tileNumbers[passwordSet[i]].toFront();
        tileNumbers2[passwordSet[i]].toFront();*/
        tilesquares3[passwordSet[i]].toFront();
    }

  }
  for (var i=0; i<inputPasswordSetCount; i++) {
      tilesquares[inputPasswordSet[i]].attr({fill: pwdsq, stroke: "blue", 'fill-opacity': 0.0, 'stroke-opacity': 1.0, 'stroke-width': 7});
      tilesquares2[inputPasswordSet[i]].attr({fill: pwdsq, stroke: "limegreen", 'fill-opacity': 0.0, 'stroke-opacity': 1.0, 'stroke-width': 3});

      tilesquares[inputPasswordSet[i]].toFront();
      tilesquares2[inputPasswordSet[i]].toFront();
  /*    tileNumbers[inputPasswordSet[i]].toFront();
      tileNumbers2[inputPasswordSet[i]].toFront();*/
      tilesquares3[inputPasswordSet[i]].toFront();
  }

}

function getPicture(callback) {
  xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        if(typeof callback === "function") {
          callback.apply(xhttp);
        }
      }
    }
    xhttp.open("GET", "http://localhost:3000/picture",true);
    xhttp.send();
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
