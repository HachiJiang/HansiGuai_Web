<?php
//设置数据格式为JSON,编码格式是utf-8
header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Methods:POST,GET');
header('Access-Control-Allow-Credentials:true'); 
header("Content-Type: application/json;charset=utf-8"); 
date_default_timezone_set('PRC');

if ($_SERVER["REQUEST_METHOD"] == "GET") {
	echo '{"success":false,"msg":"不支持GET方法"}';
} elseif ($_SERVER["REQUEST_METHOD"] == "POST"){
	if(!isset($_POST["event"]) || empty($_POST["event"])) {
	 	echo '{"success":false,"msg":"未指定事件"}';
	 	return;
	}
	switch ($_POST["event"]) {
		case "_0000":
			login();
			break;
		case "_0001":
			logout();
			break;
		default:
			break;
	}
}
//搜索username，验证password
function login(){
	if(!isset($_POST["username"]) || empty($_POST["username"]) 
	 	|| !isset($_POST["password"]) || empty($_POST["password"])) {
	 	echo '{"success":false,"msg":"输入无效"}';
	 	return;
	}
	$username = $_POST["username"];
	$password = $_POST["password"];
	$result = '{"success":false,"msg":"用户名或密码不存在"}';
	//连接数据库
	$link = new mysqli("121.41.119.102", "root", "123456","hansiguai");
	if (mysqli_connect_errno()){
	    die('Unable to connect!').mysqli_connect_error();
	}
	//查找username
	$res = $link->query("SELECT * FROM users");
	while($row = $res->fetch_assoc()){
	    if ($row["username"] == $username && $row["password"] == $password) {
	    	$result = '{"success":true,"msg":"'.$row["username"].'"}';
	    	//更新user登录时间，登录状态
	    	$currentDate = date('Y-m-d H:i:s',time());
	    	$sql = "UPDATE users SET last_login_time='$currentDate',status=true WHERE username='$username'";
	    	$link->query($sql);
				break;
	    }
	}
	//关闭数据库连接
	$link->close();
	echo $result;
}
//logout，修改user状态
function logout() {
	//连接数据库
	$link = new mysqli("121.41.119.102", "root", "123456","hansiguai");
	if (mysqli_connect_errno()){
	    die('Unable to connect!').mysqli_connect_error();
	}
	$username = $_POST["username"];
	$result = '{"success":true,"msg":"成功退出"}';
	//更新user退出时间，登录状态
	$currentDate = date('Y-m-d H:i:s',time());
	$sql = "UPDATE users SET last_logout_time='$currentDate',status=false WHERE username='$username'";
	$link->query($sql);
	//关闭数据库连接
	$link->close();
	echo $result;
}
?>