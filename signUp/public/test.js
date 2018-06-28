'use strict'

var form=document.getElementById('form');

var usernameStatus		=false,
	idStatus			=false,
	mobilePhoneStatus	=false,
	emailStatus			=false;

window.onload=function () {
	form.onsubmit=check;
	document.getElementsByName('username')[0].onblur=checkUserName;
	document.getElementsByName('id')[0].onblur=checkId;
	document.getElementsByName('mobilePhone')[0].onblur=checkPhone;
	document.getElementsByName('Email')[0].onblur=checkEmail;
	document.getElementById('reset').onclick=reset;
}

function check() {
	checkUserName();
	checkId();
	checkEmail();
	checkPhone();
	return usernameStatus&&idStatus&&mobilePhoneStatus&&emailStatus;
}
function checkUserName() {
	usernameStatus=/^[a-zA-Z][a-zA-Z0-9_]{5,17}$/.test(this.value);
	if(!usernameStatus)
		document.getElementById('usernameError').textContent=
		"用户名6~18位英文字母、数字或下划线，必须以英文字母开头";
	else
		document.getElementById('usernameError').textContent="";
	return usernameStatus;
}
function checkId() {
	idStatus=this.value.length===8&&this.value[0]!=='0';
	if(!idStatus)
		document.getElementById('idError').textContent="学号8位数字，不能以0开头";
	else
		document.getElementById('idError').textContent="";
	return idStatus;
}
function checkPhone() {
	mobilePhoneStatus = this.value.length===11&&this.value[0]!=='0';
	if(!mobilePhoneStatus)
		document.getElementById('phoneError').textContent="电话11位数字，不能以0开头";
	else
		document.getElementById('phoneError').textContent="";
	return mobilePhoneStatus;
}
function checkEmail() {
	emailStatus = /^[a-zA-Z_\-]+@(([a-zA-Z_\-])+\.)+[a-zA-Z]{2,4}$/.test(this.value);
	if(!emailStatus)
		document.getElementById('emailError').textContent="请输入正确的邮箱地址";
	else
		document.getElementById('emailError').textContent="";
	return emailStatus;
}
function reset() {
	document.getElementsByName('username')[0].value="";
	document.getElementsByName('id')[0].value="";
	document.getElementsByName('mobilePhone')[0].value="";
	document.getElementsByName('Email')[0].value="";
	document.getElementById('usernameError').textContent="";
	document.getElementById('idError').textContent="";
	document.getElementById('phoneError').textContent="";
	document.getElementById('emailError').textContent="";
}