window.onload=function () {
	if(/已被注册/.test(document.getElementById('username').textContent)||
		/已被注册/.test(document.getElementById('id').textContent)||
		/已被注册/.test(document.getElementById('phone').textContent)||
		/已被注册/.test(document.getElementById('email').textContent))
		document.getElementById('error').textContent="注册失败";
}