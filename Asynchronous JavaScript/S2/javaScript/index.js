'use strict'

$(function () {
	$('.unread').hide();
	$('#control-ring-container').on('click', '.workable', function() {
		handleButtonClick(this);
	});
	$('#button').on('mouseleave',reset);
});

function handleButtonClick(obj,callback = function(){}) {
	$(obj).removeClass('workable');
	$('.workable').attr('class','button unwork');
	$(obj).children('span').show(0,function() {
		var that=this;
		that.textContent = "...";
		var XMLHttp = new XMLHttpRequest();
		$('#button').one('mouseleave',function() {
			XMLHttp.abort();
		});
		XMLHttp.onreadystatechange = function() {
			if(XMLHttp.readyState===4 && XMLHttp.status===200) {
				that.textContent = XMLHttp.responseText;
				$(obj).attr('class',"button worked");
				$('.unwork').attr('class','button workable');
				if($('.workable').length === 0) {
					$('.info').addClass('workable').on('click',calculator);
				}
				callback();
			}
		}
		XMLHttp.open('POST',"ajax",true);
		XMLHttp.send();
	});
}
function reset() {
	$('span').text("");
	$('.info').text("").attr('class', 'info').off('click');;
	$('#button').off('mouseleave').on('mouseleave',reset);
	$('.button').attr('class','button workable');
	$('.unread').hide();
}
function calculator() {
	var num = [0,0,0,0,0];
	for(var i=0;i<5;++i) {
		num[i]=Number(document.getElementsByTagName('span')[i].textContent);
	}
	if(num[0] && num[1] && num[2] && num[3] && num[4])
		this.textContent = num[0] + num[1] + num[2] + num[3] + num[4];
	$('.info').removeClass('workable').off('click');
}