'use strict'

$(function() {
	$("#username").on("input",checkUsername);
	$("#username").on("blur",checkUsername);
	$("#password").on("input",checkPassword);
	$("#password").on("blur",checkPassword);
	$("#form").on("input",check);
	$("#signup").on("click",signup);
	if($("#info").text() === "用户名或密码错误")
		$('#info').addClass('error');
});

function checkUsername() {
	if($("#username").val()=="")
		$("#usernameError").text("请输入用户名");
	else
		$("#usernameError").text("");
}

function checkPassword() {
	if($("#password").val()=="")
		$("#passwordError").text("请输入密码");
	else
		$("#passwordError").text("");
}
function check() {
	if($("#username").val()!=""&&$("#password").val()!="") {
		$("#submit").addClass("submitenable").removeAttr("disabled");
	} else
		$("#submit").removeClass("submitenable").attr("disabled","disabled");
}