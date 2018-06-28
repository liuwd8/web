var validator     = require('../public/javascripts/validator');
var errorMessage  = {
  isTrue : true,
  usernameError : "",
  passwordError : "",
  passwordAgainError : "",
  phoneError : "",
  emailError : "",
  sidError :""
}

var validatorOfPost = function (data) {
  if(data.password !== data.passwordAgain) {
    errorMessage.passwordAgainError = "前后两次输入的密码不一致";
    errorMessage.isTrue = false;
  }
  if(!validator.username.isValid(data.username)) {
    errorMessage.isTrue = false;
    errorMessage.usernameError = validator.username.errorMessage;
  }
  if(!validator.password.isValid(data.password)) {
    errorMessage.isTrue = false;
    errorMessage.passwordError = validator.password.errorMessage;
  }
  if(!validator.sid.isValid(data.sid)) {
    errorMessage.isTrue = false;
    errorMessage.sidError = validator.sid.errorMessage;
  }
  if(!validator.email.isValid(data.email)) {
    errorMessage.isTrue = false;
    errorMessage.emailError = validator.email.errorMessage;
  }
  if(!validator.phone.isValid(data.phone)) {
    errorMessage.isTrue = false;
    errorMessage.phoneError = validator.phone.errorMessage;
  }
  return errorMessage;
}
exports = module.exports = validatorOfPost;