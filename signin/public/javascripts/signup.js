$(function () {
	var funcCheckInfo = function() {
		checkInfo(this.name,this.value);
	};
	var funcCheckValid = function() {
		checkValid(this.name,this.value);
	};
	$("#form").on("input",checkBeforeSubmit);
	$(".input").on("blur",funcCheckInfo).on("input",funcCheckValid);
	$("#password").on("blur",function() {
		if($("#passwordAgain").val()!=="" && $("#passwordAgain").val() !== $(this).val())
			$("#passwordAgainError").text("两次输入的密码不相同");
		else
			$("#passwordAgainError").text("");
	});
	$("#passwordAgain").off().on("blur",function() {
		if(this.value !== $("#password").val()) {
			$("#passwordAgainError").text("两次输入的密码不相同");
		} else {
			$("#passwordAgainError").text("");
		}
	});
	$("#reset").on('click',reset);
	$('.input').trigger('input');
});

function checkInfo(name,val) {
	if(!validator[name].state) {
		$("#"+name+"Error").text(validator[name].errorMessage);
	} else {
		$("#"+name+"Error").text("");
	}
}
function checkValid(name,val) {
	if(!validator[name].isValid(val)) {
		validator[name].state = false;
	} else {
		validator[name].state = true;
	}
}
function checkBeforeSubmit() {
	if(validator.username.state && validator.password.state &&
	validator.phone.state && validator.sid.state && validator.email.state
	&& $("#passwordAgain").val() === $("#password").val())
		$("#submit").addClass("submitenable").removeAttr("disabled");
	else
		$("#submit").removeClass("submitenable").attr("disabled","disabled");
}
function reset() {
	$(".input").val("");
	$(".error").text("");
}