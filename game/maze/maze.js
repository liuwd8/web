var re=document.getElementById("result");
var array=document.getElementsByClassName('wall');
var ck=document.getElementById("maze-container");
var flag=false;
var count=false;

window.onload=function() {
  var st=document.getElementById("start");
  st.onmouseover=begin;
  var en=document.getElementById("end");
  en.onmouseover=end;
  ck.onmouseenter=cheatCheckPass;
  ck.onmouseleave=cheatCheckFaild;
}

function begin() {
  flag=true; //whether game start or not
  re.textContent="";
  for(var i=0;i<array.length;++i) {
    array[i].onmouseover=gameFaild;
    array[i].onmouseout=gameReset;
  }
  ck.setAttribute("class","curP");
}

function gameFaild() {
  this.setAttribute("class","gameFaild");
  flag=false;
  re.textContent="You Lose.";
}

function gameReset() {
  this.setAttribute("class","wall-show");
  gameOver();
}

function gameOver() {
  for(var i=0;i<array.length;++i) {
    array[i].onmouseover=vo;
    array[i].onmouseout=vo;
  }
  flag=false;
  ck.removeAttribute("class");
}

function vo() {}
function cheatCheckPass() {
  count=true;
}
function cheatCheckFaild() {
  count=false;
}
function end() {
  if(flag&&count)
    re.textContent="You Win";
  else
    re.textContent="Don't cheat,you should start from the \"S\" and move to the \"E\"inside the maze!";
  gameOver();
}