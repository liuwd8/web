'use strict'

var fs   =require('fs'),
	url  =require('url'),
	qs   =require('querystring'),
	http =require('http');

var users=[];

const sourcedir="../public";

var server =http.createServer(function (req,res) {
	var reqUrl=req.url=='/'?"/index.html":req.url;
	var username=qs.parse(url.parse(req.url).query).username;
	var Index=isRegisterUser(username);
	if(username&&Index) {
		changeHtmlFile(res,sourcedir+"/info.html",users[Index-1]);
	} else if(req.method==='POST') {
		var formData="";
		req.on("data",function(postdata) {
			formData+=postdata;
			var jsondata=qs.parse(formData);
			if(registerUser(jsondata)) {
				reqUrl="/info.html";
				changeHtmlFile(res,sourcedir+reqUrl,jsondata);
				users.push(jsondata);
			} else {
				reqUrl="/index.html";
				sendError(res,sourcedir+reqUrl,jsondata);
			}
		});
	} else {
		if(username) reqUrl="/index.html";
		sendFile(res,sourcedir+reqUrl);
	}
}).listen(8000);

console.log("Server is listening");

function sendFile(res,pathname) {
	switch(pathname.match(/\.[^.]+$/)[0]) {
		case ".html":
			res.writeHead(200, {"Content-Type": "text/html"});
			break;
		case ".js":
			res.writeHead(200, {"Content-Type": "text/javascript"});
			break;
		case ".css":
			res.writeHead(200, {"Content-Type": "text/css"});
			break;
		case ".gif":
			res.writeHead(200, {"Content-Type": "image/gif"});
			break;
		case ".jpg":
			res.writeHead(200, {"Content-Type": "image/jpg"});
			break;
		case ".png":
			res.writeHead(200, {"Content-Type": "image/png"});
			break;
		default:
			res.writeHead(200, {"Content-Type": "application/octet-stream"});
	}

	fs.readFile(pathname,function(err,data) {
		if(err) {
			res.writeHead(404, {"Content-Type": "text/html"});
			res.end("<h1>404 Not Found</h1>");
		} else {
			res.end(data);
		}
	});
}
function changeHtmlFile(res,pathname,jsondata) {
	var input=fs.createReadStream(pathname,{encoding:'utf8'});
	var str="";
	input.on('data',function(data) {
		str=data.replace("用户名：","用户名："+jsondata.username);
		str=str.replace("学号：","学号："+jsondata.id);
		str=str.replace("电话：","电话："+jsondata.mobilePhone);
		str=str.replace("邮箱：","邮箱："+jsondata.Email);
	});
	input.on('error', function(err) { throw err; });
	input.on('end', function() {
		res.write(str);
		res.end();
	});
}
function registerUser(jsondata) {
	if(isRegisterUser(jsondata.username)||
		isRegisterUser(jsondata.id)||
		isRegisterUser(jsondata.mobilePhone)||
		isRegisterUser(jsondata.Email))
		return false;
	else if(/^[a-zA-Z][a-zA-Z0-9_]{5,17}$/.test(jsondata.username)&&
			/^[1-9][0-9]{7}$/.test(jsondata.id)&&
			/^[1-9][0-9]{10}$/.test(jsondata.mobilePhone)&&
			/^[a-zA-Z_\-]+@(([a-zA-Z_\-])+\.)+[a-zA-Z]{2,4}$/.test(jsondata.Email))
			return true;
	else 
		return false;
}
function isRegisterUser(str) {
	for (var i = users.length - 1; i >= 0; i--) {
		if(users[i].username===str||
			users[i].id===str||
			users[i].mobilePhone===str||
			users[i].Email===str)
			return i+1;
	}
	return 0;
}
function sendError(res,pathname,jsondata) {
	var input=fs.createReadStream(pathname,{encoding:'utf8'});
	var str="";
	input.on('data',function(data) {
		str+=data;
		str=str.replace("<input type=\"text\" name=\"username\" placeholder=\"用户名\">",
				"<input type=\"text\" name=\"username\" placeholder=\"用户名\" value=\""
				+jsondata.username+"\">");
		if(isRegisterUser(jsondata.username)){
			str=str.replace("<div id=\"usernameError\" class=\"error\"></div>",
				"<div id=\"usernameError\" class=\"error\">该用户名已被注册</div>");
		}
		str=str.replace("<input type=\"text\" name=\"id\" placeholder=\"学号\">",
				"<input type=\"text\" name=\"id\" placeholder=\"学号\" value=\""+jsondata.id+"\">");
		if(isRegisterUser(jsondata.id)){
			str=str.replace("<div id=\"idError\" class=\"error\"></div>",
				"<div id=\"idError\" class=\"error\">该学号已被注册</div>");
		}
		str=str.replace("<input type=\"text\" name=\"mobilePhone\" placeholder=\"手机\">",
				"<input type=\"text\" name=\"mobilePhone\" placeholder=\"手机\" value=\""
				+jsondata.mobilePhone+"\">");
		if(isRegisterUser(jsondata.mobilePhone)){
			str=str.replace("<div id=\"phoneError\" class=\"error\"></div>",
				"<div id=\"phoneError\" class=\"error\">该手机号码已被注册</div>");
		}
		str=str.replace("<input type=\"text\" name=\"Email\" placeholder=\"邮箱\">",
				"<input type=\"text\" name=\"Email\" placeholder=\"邮箱\" value=\""
				+jsondata.Email+"\">");
		if(isRegisterUser(jsondata.Email)){
			str=str.replace("<div id=\"emailError\" class=\"error\"></div>",
				"<div id=\"emailError\" class=\"error\">该手机号码已被注册</div>");
		}
	});
	input.on('error', function(err) { throw err; });
	input.on('end', function() {
		res.write(str);
		res.end();
	});
}