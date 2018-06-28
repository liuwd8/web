$(function() {

  $('input').focus(function(){
      $(this).prev().addClass('red');
  });
  $('input').blur(function(){
      $(this).prev().removeClass('red');
  });

  function check() {
    if($("#username").val()!=""&&$("#password").val()!="") {
      $("#signin").removeAttr("disabled");
    } else
      $("#signin").attr("disabled","disabled");
  }
  function checkValidator() {
    if(/^[a-zA-Z][a-zA-Z0-9_]{5,17}$/.test($("#username").val()) && /^[a-zA-Z0-9_\-]{6,12}$/.test($("#password").val()))
      return true;
    $('#error p').innerText('用户名或密码错误');
    return false;
  }

  $("#form").on("input",check);
  $('#signin').on('click',checkValidator);
});