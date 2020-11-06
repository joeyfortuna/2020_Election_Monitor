const targetNode = document.querySelector('.e-cmp-content');

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };
var bThrobbed = false;

var html = '<audio controls autoplay="true" src="okay.mp3" id = "okayPlay"><source src="okay.mp3" type="audio/mpeg"> </audio>';
var dv = document.createElement("div");
dv.innerHTML=html;
setTimeout(function() {
document.body.prepend(dv);
},500);
function throb(count) {
  var p = document.getElementById("okayPlay");
  p.src = chrome.extension.getURL("okay.mp3")
  var d = document.querySelector('#site-content');
  var c = document.querySelector('#results-president');
  var r = document.querySelector("[data-race='PA-G-P-2020-11-03']");
  var data = JSON.parse(r.getAttribute('data-candidates'));
  var html="<div style='padding:20px;'><div style='color:black;'>PA:";
  
  var bokay = true;
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
    html+="<div style='color:black;'>"+can.last_name+": "+can.votes+"</div>";
  }
  html+="</div>"
  if (biden<trump) {
    bokay = false;
  }
  r = document.querySelector("[data-race='GA-G-P-2020-11-03']");
  data = JSON.parse(r.getAttribute('data-candidates'));
  html+="<div style='color:black;'>GA:";
  biden = 0; 
  trump = 0;
  for(var i in data) {
    var can = data[i];
    if (can.last_name.toLowerCase() == 'biden') {
      biden=parseInt(can.votes);
    }
    else if (can.last_name.toLowerCase() == 'trump') {
      trump=parseInt(can.votes);
    }
    html+="<div style='color:black;'>"+can.last_name+": "+can.votes+"</div>";
  }
  html+="</div></div>";
  if (biden<trump) {
    bokay = false;
  }
  if (bokay) {
  document.getElementById("scoreboard").style.color="blue";
    p.play();
  }
  var d = document.querySelector('.e-nav-container');
  if (!d || typeof d=='undefined') {
    document.body.prepend(document.getElementById("scoreboard"));
  }
  else 
    d.appendChild(document.getElementById("scoreboard"));
  document.getElementById("scoreboard").innerHTML=html;

  var d = document.querySelector('#site-content');
  if (count % 2==0) {
    d.style.backgroundColor="blue";
    c.style.display="none";
  }
  else {
    d.style.backgroundColor="white";
    c.style.display="block";

  }
  count++;
  if (count<=5) {
    setTimeout(function() {
      throb(count);
    },50);
  }
}
var bCollapsed = false;
setTimeout(function() {
  var d = document.createElement("div")
  d.id = "scoreboard";
  d.setAttribute("id","scoreboard");
  d.style.padding="20px;"
  d.style.fontFamily = "Arial";
  d.style.position="absolute";
  d.style.left="0px";
  d.style.cursor="pointer";
  d.style.top="0px";
  d.style.width="200px";
  d.style.height="200px";
  d.style.backgroundColor="white";
  d.style.opacity="0.8";
  d.style.zIndex="20000";
  var n = document.querySelector('.e-nav-container');
  if (!n || typeof n=='undefined') {
    document.body.prepend(d);
  }
  else 
    n.appendChild(d);
  d.addEventListener("click",function() {
    if (!bCollapsed) {
      d.style.height="50px";
      d.style.fontSize = "8px"
    }
    else {
      d.style.height="200px";
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
                throb(0);
              },50);
            }
        }
    }
};

const myobs = new MutationObserver(callback);
myobs.observe(targetNode, config);