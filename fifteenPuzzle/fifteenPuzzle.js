var gameBlocks=16;
var randomTimes=160;

window.onload=function() {
	var image=document.getElementsByTagName('img')[0];
	var drawing=document.getElementById("1-gameBlock");
	var gameArea=document.getElementById("gameArea");
	drawing.value=1;
	drawGameArea(gameArea,drawing);
	if(drawing.getContext) {
		drawGameBlocks(image);
	}
	document.getElementById("gameStart").onclick=function(ele) {
		this.textContent="重新开始";
		redraw(image);
		startGame();
	};
}
function startGame() {
	var blocks=document.getElementsByTagName('canvas');
	for(var i=0;i<blocks.length;++i) {
		blocks[i].onclick=swap;
	}
}
function swap() {
	var Index=parseInt(this.id)-1;
	var image=document.getElementsByTagName('img')[0];
	var blocks=document.getElementsByTagName('canvas');
	for(var i=0;i<blocks.length;++i)
		if(blocks[i].value==16&&((Index-i==4&&Index>3)||
			(Index%4>0&&Index-i==1)||(Index%4<3&&Index-i==-1)||(Index<12&&Index-i==-4))) {
			var temp=blocks[Index].value;
			blocks[Index].value=blocks[i].value;
			blocks[i].value=temp;
			blocks[Index].setAttribute("class","canvas");
			blocks[i].setAttribute("class","canvas scale");
			var context=blocks[Index].getContext("2d");
			context.clearRect(0,0,blocks[Index].width,blocks[Index].height);
			context.fillStyle="rgba(216,216,216,1)";
			context.fillRect(0,0,blocks[Index].width,blocks[Index].height);
			context=blocks[i].getContext("2d");
			context.clearRect(0,0,blocks[i].width,blocks[i].height);
			context.drawImage(image,
				((blocks[i].value-1)%4)*88,(Math.floor((blocks[i].value-1)/4))*88,
				blocks[i].width,blocks[i].height,
				0,0,blocks[i].width,blocks[i].height);
			break;
		}
	if(check()) {
		document.getElementById("result").textContent="You win."
		var blocks=document.getElementsByTagName('canvas');
		for(var i=0;i<blocks.length;++i) {
			blocks[i].onclick=function(){};
		}
	}
}
function check() {
	var blocks=document.getElementsByTagName('canvas');
	for(var i=0;i<blocks.length;++i) {
		if(blocks[i].value!=i+1)
			return false;
	}
	return true;
}
function drawGameArea(ele1,ele2) {
	var node;
	ele2.setAttribute("class","canvas scale");
	ele1.removeChild(ele1.lastChild);
	for(var i=0;i<gameBlocks-1;++i) {
		node=ele2.cloneNode(true);
		node.value=i+2;
		node.id=node.value.toString()+"-gameBlock";
		ele1.appendChild(node);
	}
	ele1.lastChild.setAttribute("class","canvas");
}
function drawGameBlocks(ele) {
	var blocks=document.getElementsByTagName('canvas');
	var context;
	for (var i = 0; i <blocks.length; ++i) {
		context=blocks[i].getContext('2d');
		if(blocks[i].value==16) {
			context.fillStyle="rgba(216,216,216,1)";
			context.fillRect(0,0,blocks[i].width,blocks[i].height);
		} else {
			context.drawImage(ele,
				((blocks[i].value-1)%4)*88,(Math.floor((blocks[i].value-1)/4))*88,
				blocks[i].width,blocks[i].height,0,0,blocks[i].width,blocks[i].height);
			context.strokeStyle="rgba(216,216,216,1)";
			context.strokeRect(0,0,blocks[i].width,blocks[i].height);
		}
	}
}
function redraw(ele) {
	var arr=new Array;
	var aIndex,bIndex,temp;
	var blocks=document.getElementsByTagName('canvas');
	for(var i=0;i<gameBlocks;++i)
		arr[i]=i+1;
	do {
		for(var i=0;i<randomTimes;++i) {
			aIndex=Math.floor(Math.random()*15);
			bIndex=Math.floor(Math.random()*15);
			temp=arr[aIndex];
			arr[aIndex]=arr[bIndex];
			arr[bIndex]=temp;
		}
	}while(reverseOrder(arr)%2!=0)
	for(var i=0;i<gameBlocks;++i) {
		blocks[i].value=arr[i];
		blocks[i].getContext("2d").clearRect(0,0,blocks[i].width,blocks[i].height);
	}
	drawGameBlocks(ele);
}
function reverseOrder(ele) {
	var count=0;
	for(var i=1;i<ele.length;++i) {
		for(var j=0;j<i;++j)
			if(ele[j]>ele[i])
				++count;
	}
	return count;
}