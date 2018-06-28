var validator = {
	username : {
		state : false,
		errorMessage : "6~18位英文字母、数字或下划线，必须以英文字母开头",
		isValid: function (username) {
			return /^[a-zA-Z][a-zA-Z0-9_]{5,17}$/.test(username);
		}
	},
	password : {
		state : false,
		errorMessage : "密码为6~12位数字、大小写字母、中划线、下划线",
		isValid : function (passward) {
			return /^[a-zA-Z0-9_\-]{6,12}$/.test(passward);
		}
	},
	sid : {
		state : false,
		errorMessage : "学号8位数字，不能以0开头",
		isValid : function (sid) {
			return /^[1-9][0-9]{7}$/.test(sid);
		}
	},
	phone : {
		state : false,
		errorMessage : "电话11位数字，不能以0开头",
		isValid : function (phone) {
			return /^[1-9][0-9]{10}$/.test(phone);
		}
	},
	email : {
		state : false,
		errorMessage : "请输入正确的邮箱地址",
		isValid : function (email) {
			return /^[a-zA-Z_\-]+@(([a-zA-Z_\-])+\.)+[a-zA-Z]{2,4}$/.test(email);
		}
	}
}

if(typeof module !== 'undefined') {
	exports = module.exports = validator;
}