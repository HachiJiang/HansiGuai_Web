$(function(){
	//全局变量
	var active_href = $("#menu-nav li.active a").attr("href");

	// 为关闭warning窗口绑定事件：转向登陆页
	$('#warningMsg').on('hide.bs.modal', function() {
		location.href = "index.html";
	});
	// 读取session中用户信息，session验证失败则转至登陆页
	var username = localStorage.getItem("currentUser");
	if(!username) {
		$("#myModalLabel").html("Warning: 请先登录!");
		$("#warningMsg").modal({keyboard:false});
		return;
	}
	// 用户存在则展示当前用户内容
	$("#user").html("Welcome, <strong>" + username + "</strong>!");

	//切换页面分区事件
	$("#menu-nav .navbar-collapse li").click(function () {
		var href = $(this).children("a").attr('href');
		
		if ('#' !== href) {
			$("#menu-nav li.active").removeClass("active");
			$("#main div" + active_href).removeClass("active");
			$(this).addClass("active");
	    active_href = href;
	    $("#main div" + active_href).addClass("active");
	  }
  });
	// sign out事件
	$("#signOut").click(function() {
		var currentUser = localStorage["currentUser"];
		//修改数据库中user状态
		$.ajax({
			type:"POST",
			url:"php/index.php",
			data:{
				event: "_0001",
				username: currentUser
			},
			dataType:"json",
			success:function(data){
				if (data.success) {
					//数据请求成功，且验证成功，跳转回登录页面
					location.href = "index.html";
					localStorage.clear();
				} else {
					//数据请求成功，但验证失败
					alert(data.msg);
				}
			},
			error:function(jqXHR){
				//数据请求失败，弹出报错
				alert("连接失败");
			}
		});
	})
})