const targetNode = document.querySelector('.e-cmp-content');

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };
var bThrobbed = false;

var playerHTML = '<audio controls autoplay="true" src="okay.mp3" id = "okayPlay"><source src="okay.mp3" type="audio/mpeg"> </audio>';
var dv = document.createElement("div");
dv.innerHTML=playerHTML;
setTimeout(function() {
  document.body.prepend(dv);
},500);

function checkRace(raceSelector) {
  var r = document.querySelector(raceSelector);
  var data = JSON.parse(r.getAttribute('data-candidates'));
  var biden = 0;
  var trump = 0;
  for(var i in data) {
    var can = data[i];
    if (can.last_name.toLowerCase() == 'biden') {
      biden=parseInt(can.votes);
    }
    else if (can.last_name.toLowerCase() == 'trump') {
      trump=parseInt(can.votes);
    }
  }
  return {"biden":biden, "trump":trump}
}

function monitorElection() {
  var races = ["PA","GA","NV","AZ"];
  var bOkay = true;
  var returnData = [];
  var html = "<div style='padding:20px;'>";
  for (var i in races) {
    var race = "[data-race='"+races[i]+"-G-P-2020-11-03']";
    var state = races[i];
    var data = checkRace(race);
    returnData.push(data);
    var goodRace = data["biden"]>data["trump"];
    if (!goodRace) {
      bOkay = false;
    }
    var sbColor="blue";
    if (goodRace) sbColor="blue";
    else sbColor="red";
    html+="<div style='margin-top:10px;color:"+sbColor+";'>"+state+":"
    html+="<div style='color:"+sbColor+";'>Biden: "+data["biden"]+"</div>";
    html+="<div style='color:"+sbColor+";'>Trump: "+data["trump"]+"</div>";
    html+="</div>";
  }
  html+="</div>";
  var d = document.querySelector('.e-nav-container');
  if (!d || typeof d=='undefined') {
    document.body.prepend(document.getElementById("scoreboard"));
  }
  else d.appendChild(document.getElementById("scoreboard"));
  document.getElementById("scoreboard").innerHTML=html;
  var p = document.getElementById("okayPlay");
  if (bOkay) {
    p.src = chrome.extension.getURL("okay.mp3");
    p.play();
  }
  flashScreen(0);
}

function flashScreen(count) {
   var width= window.innerWidth || document.body.clientWidth;
   var height= window.innerHeight || document.body.clientHeight
  var fs = document.getElementById("flashScreen");
  fs.style.minWidth = width+"px";
  fs.style.width = width+"px";
  fs.style.minHeight = height+"px";
  fs.style.height = height+"px";
  fs.style.opacity = ".8";
  fs.style.backgroundColor="blue";
  fs.style.position="absolute";
  fs.style.top="0px";
  fs.style.left="0px";
  fs.style.zIndex = "4000";

  //var d = document.querySelector('#site-content');
  if (count % 2==0) {
    fs.style.display="block";
    //c.style.display="none";
  }
  else {
    fs.style.display="none";
   // c.style.display="block";

  }
  count++;
  if (count<=5) {
    setTimeout(function() {
      flashScreen(count);
    },50);
  }
}
var bCollapsed = false;

setTimeout(function() {
  var d = document.createElement("div");
  d.id = "flashScreen";
  d.setAttribute("id","flashScreen");
  document.body.appendChild(d);
  d.style.display="none";
  
  d = document.createElement("div")
  d.id = "scoreboard";
  d.setAttribute("id","scoreboard");
  d.style.padding="20px;"
  d.style.fontFamily = "Arial";
  d.style.position="absolute";
  d.style.left="0px";
  d.style.cursor="pointer";
  d.style.top="0px";
  d.style.width="200px";
  d.style.height="320px";
  d.style.backgroundColor="white";
  d.style.opacity = "1.0"
  d.style.zIndex="20000";
  var n = document.querySelector('.e-nav-container');
  if (!n || typeof n=='undefined') {
    document.body.prepend(d);
  }
  else 
    n.appendChild(d);
  d.addEventListener("click",function() {
    if (!bCollapsed) {
      d.style.height="20px";
      d.style.fontSize = "1px"
    }
    else {
      d.style.height="320px";
      d.style.fontSize = "20px"
    }
    bCollapsed = !bCollapsed;
  });
},1000);
const callback = function(mutationsList, observer) {
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            if (!bThrobbed) {
              bThrobbed = true;
              console.log(document.querySelector('.e-all-text').innerText);
              setTimeout(function() {bThrobbed=false;},2000);
              setTimeout(function() {
                monitorElection();
              },50);
            }
        }
    }
};

const myobs = new MutationObserver(callback);
myobs.observe(targetNode, config);
