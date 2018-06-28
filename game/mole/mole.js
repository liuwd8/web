var moles=document.getElementById("moles");
var stOrSp=document.getElementById("stOrSp");
var times=document.getElementById("time");
var behav=document.getElementById("behaver");
var but=document.getElementsByTagName("button");
var score=document.getElementById("score");
var timer=30;
var scoreNum=0;

window.onload=function() {
	var node;
	moles.removeChild(moles.lastChild);
	for(var i=0;i<59;++i) {
		node=moles.childNodes[1].cloneNode(true);
		node.name=(i+1).toString();
		moles.appendChild(node);
	}
	stOrSp.onclick=startGame;
}
function startGame() {
	stOrSp.onclick=stopGame;
	produceMoles();
	playGame();
}
function playGame() {
	score.textContent=scoreNum;
	stOrSp.onclick=stopGame;
	for (var i = but.length - 1; i >= 1; i--) {
		but[i].onclick=produceScore;
	}
	behav.textContent="Playing";
	timeCountDown(timer);
}
function timeCountDown() {
	if(timer>0) {
		times.textContent=timer;
		timer--;
		t=setTimeout("timeCountDown()",1000);
	} else if(timer==0) {
		times.textContent=0;
		behav.textContent="Game Over";
		for (var i = but.length - 1; i >= 1; i--) {
			but[i].onclick=vo;
			if(but[i].className=="moles-button mole")
				but[i].setAttribute("class","moles-button");
		}
		stOrSp.onclick=startGame;
		timer--;
		setTimeout("timeCountDown()",1);
	} else {
		timer=30;
		clearTimeout(t);
		alert("Game Over.\nYour score is: "+scoreNum.toString());
		scoreNum=0;
	}
}
function vo() {}
function stopGame() {
	stOrSp.onclick=playGame;
	behav.textContent="Stop";
	for (var i = but.length - 1; i >= 1; i--) {
		but[i].onclick=vo;
	}
	clearTimeout(t);
}
function produceMoles() {
	var num=Math.floor(Math.random()*60);
	var ele=document.getElementsByName(num.toString());
	ele[0].setAttribute("class","moles-button mole");
}
function produceScore() {
	if(this.className=="moles-button mole") {
		scoreNum++;
		score.textContent=scoreNum;
		this.setAttribute("class","moles-button");
		produceMoles();
	} else if(scoreNum>0) {
		scoreNum--;
		score.textContent=scoreNum;
	}
}