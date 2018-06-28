$(function() {
	$('.icon').one('click',robot);
});

function robot() {
	$('#control-ring-container').off('click').on('click', '.workable', function(){
		handleButtonClick(this,function() {
			$('.workable').click();
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