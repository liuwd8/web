$(function() {
	$('.icon').one('click',robot);
});

function robot() {
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
	var count = 0;
	$('#control-ring-container').off('click').on('click', '.workable', function(){
		handleButtonClick(this,function(){
			++count;
			if(count < num.length)
				$('#'+num[count]).click();
			else
				$('.info').click();
		});
	});
	$('#button').off('mouseleave').on('mouseleave',resetRobot);
	$('#'+num[count]).click();
}
function resetRobot() {
	reset();
	$('.icon').off('click').one('click',robot);
	$('#control-ring-container').off('click').on('click', '.workable', function(){
		handleButtonClick(this);
	});
	$('#showOrder').text("");
}