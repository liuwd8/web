$(function() {
	$('.icon').one('click',robot);
});

function robot() {
	$('#control-ring-container').off('click').on('click', '.workable', function(){
		var that=this;
		setTimeout(handleButtonClick,0,that,function(){
			$('.button').attr('class','button worked');
			$('.info').click();
		});
	});
	$('#button').off('mouseleave').on('mouseleave',resetRobot);
	$('.workable').click();
}
function resetRobot() {
	reset();
	$('.icon').off('click').one('click',robot);
	$('#control-ring-container').off('click').on('click', '.workable', function(){
		handleButtonClick(this);
	});
}