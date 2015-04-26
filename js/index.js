$(function(){
	// 用户如果已经登录，直接跳转至main.index
	if(sessionStorage["currentUser"]) {
		location.href = "main.html";
	}
	$("#submitBtn").click(function() {
		if ($("#username").val() == "" || $("#password").val() == "") {
			$("#warningMsg").html("用户名或密码不能为空！");
			return;
		}
		$.ajax({
			type:"POST",
			url:"php/index.php",
			data:{
				event: "_0000",
				username:$("#username").val(),
				password:$("#password").val()
			},
			dataType:"json",
			success:function(data){
				if (data.success) {
					//数据请求成功，且验证成功，跳转页面，显示username
					location.href = "main.html";
					sessionStorage.setItem("currentUser", $("#username").val());
					// $("#login").replaceWith($("#userInfo"));
					// $("#user").html("Welcome, " + data.msg + "!");
					// $("#userInfo").removeAttr("hidden"); 
				} else {
					//数据请求成功，但验证失败
					$("#warningMsg").html(data.msg);
				}
			},
			error:function(jqXHR){
				//数据请求失败，弹出报错
				$("#warningMsg").html("连接失败");
			}
		});
	});
});