$(function() {
	$('.icon').one('click',robot);
});

function robot() {
	$('#control-ring-container').off('click');
	$('#button').off('mouseleave').on('mouseleave',resetRobot);

	var num = [];
	for(var i=0;i<$('.workable').length;++i) {
		num.push($('.workable').eq(i).attr('id'));
	}
	for (var i = 99; i >= 0; i--) {
		var random_num1 = Math.floor(Math.random() * num.length);
		var random_num2 = Math.floor(Math.random() * num.length);
		var midValue = num[random_num1];
		num[random_num1] = num[random_num2];
		num[random_num2] = midValue;
	}
	var str="";
	for(var j=0;j<num.length;++j) {
		str+=$('#' + num[j]).text();
	}
	$('#showOrder').text(str);
	var count = {num:0};
	bindFunction(num,count);
	$('#'+num[count.num]).click();
}
function bindFunction(num,count) {
	var clickdata = {message:'',currentSum:0};
	for(var i=0;i<$('.worked').length;++i) {
		clickdata.currentSum+=Number($('.worked').eq(i).children('span').text());
	}
	$('#mask').off('click').one('click', function() {
		if($(this).hasClass('workable')) {
			maskHandler(this,clickdata,function(){
				clickNextButton(num,count);
			});
		}
	});
	$('#history').off('click').one('click', function() {
		if($(this).hasClass('workable')) {
			historyHandler(this,clickdata,function(){
				clickNextButton(num,count);
			});
		}
	});
	$('#message').off('click').one('click', function() {
		if($(this).hasClass('workable')) {
			messageHandler(this,clickdata,function(){
				clickNextButton(num,count);
			});
		}
	});
	$('#setting').off('click').one('click', function(){
		if($(this).hasClass('workable')) {
			settingHandler(this,clickdata,function(){
				clickNextButton(num,count);
			});
		}
	});
	$('#sign').off('click').one('click', function(){
		if($(this).hasClass('workable')) {
			signHandler(this,clickdata,function(){
				clickNextButton(num,count);
			});
		}
	});
	$('.info').off('click').one('click', function() {
		$('#showMessage').html($('#showMessage').html()+
				'<p>大气泡：楼主异步调用战斗力感人，目测不超过' + clickdata.currentSum+"</p>");
	})
}
function resetRobot() {
	reset();
	$('.button').off('click');
	$('.icon').off('click').one('click',robot);
	$('#control-ring-container').off('click').on('click', '.workable', function(){
		handleButtonClick(this);
	});
	$('#showOrder').text("");
	$('#showMessage').html('');
}
function clickNextButton(arr,index) {
	++index.num;
	if(index.num < arr.length)
		$('#'+arr[index.num]).click();
	else
		$('.info').click();
}
function clickCallBackHandler(obj,err,data,callback){
	handleButtonClick(obj,function(){
		data.currentSum += Number($(obj).children('span').text());
		if(!!err)
			data.message += data.currentSum;
		$('#showMessage').html($('#showMessage').html()+"<p>" + data.message + "</p>");
		callback();
	});
}
function maskHandler(obj,data,callback) {
	var err;
	if(Math.floor(Math.random() * 4) === 0) {
		err = new Error();
		data.message = "A: 这不是一个秘密 ";
	} else {
		data.message = "A: 这是一个天大的秘密";
	}
	clickCallBackHandler(obj,err,data,callback);
}
function historyHandler(obj,data,callback) {
	var err;
	if(Math.floor(Math.random() * 4) === 0) {
		err = new Error();
		data.message = "B: 我知道 ";
	} else {
		data.message = "B: 我不知道";
	}
	clickCallBackHandler(obj,err,data,callback);
}
function messageHandler(obj,data,callback) {
	var err;
	if(Math.floor(Math.random() * 4) === 0) {
		err = new Error();
		data.message = "C: 你知道 ";
	} else {
		data.message = "C: 你不知道";
	}
	clickCallBackHandler(obj,err,data,callback);
}
function settingHandler(obj,data,callback) {
	var err;
	if(Math.floor(Math.random() * 4) === 0) {
		err = new Error();
		data.message = "D: 他知道 ";
	} else {
		data.message = "D: 他不知道";
	}
	clickCallBackHandler(obj,err,data,callback);
}
function signHandler(obj,data,callback) {
	var err;
	if(Math.floor(Math.random() * 4) === 0) {
		err = new Error();
		data.message = "E: !才怪 ";
	} else {
		data.message = "E: 才怪";
	}
	clickCallBackHandler(obj,err,data,callback);
}
