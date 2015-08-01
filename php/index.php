<?php
//设置数据格式为JSON,编码格式是utf-8
header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Methods:POST,GET');
header('Access-Control-Allow-Credentials:true'); 
header("Content-Type: application/json;charset=utf-8"); 
date_default_timezone_set('PRC');

function p($var)
{
  echo '<pre>';
  print_r($var);
  echo '<pre/>';
}

if(!isset($_REQUEST["event"]) || empty($_REQUEST["event"])) {
 	echo '{"success":false,"msg":"未指定事件"}';
 	return;
}

switch ($_REQUEST["event"]) {
	case "_0000":
		login();
		break;
	case "_0001":
		logout();
		break;
	case "_0002":
		saveArticle();
		break;
	case "_0003":
		getArticlesByPage();
		break;
	case "_0004":
		getSingleArticleById();
		break;
	case "_0005":
		deleteSingleArticleById();
		break;
	default:
		break;
}

function daddslashes($str) {
	return (!get_magic_quotes_gpc())?addslashes($str):$str;
}

function error($flag, $log) {
	$error = json_decode('{}');
	$error->success = $flag;
	$error->msg = $log;
	return $error;
}

//搜索username，验证password
function login(){
	$username = $_REQUEST["username"];
	$password = $_REQUEST["password"];
	if(!isset($username) || empty($username) 
	 	|| !isset($password) || empty($password)) {
	 	echo '{"success":false,"msg":"输入无效"}';
	 	return;
	}
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

	$username = $_REQUEST["username"];
	//更新user退出时间，登录状态
	$currentDate = date('Y-m-d H:i:s',time());
	$sql = "UPDATE users SET last_logout_time='$currentDate',status=false WHERE username='$username'";
	$link->query($sql);
	//关闭数据库连接
	$link->close();
	echo '{"success":true,"msg":"成功退出"}';
}

//保存文章
function saveArticle() {
	// GET VARS
  $id = trim($_REQUEST['id']);
  if(!$id)
    echo json_encode(error(false, 'id not exist'));
  $id = daddslashes($id);

  $author = trim($_REQUEST['author']);
  if(!$author)
    echo json_encode(error(false, 'author not exist'));

  $title = daddslashes(trim($_REQUEST['title']));
  if(!$title)
    echo json_encode(error(false, 'title not exist'));

  $tags = trim($_REQUEST['tags']); 

  $content = trim($_REQUEST['content']);
  if(!$content)
    echo json_encode(error(false, 'content not exist'));
	$content = daddslashes($content);

	//连接数据库
	$link = new mysqli("121.41.119.102", "root", "123456","hansiguai");
	if (mysqli_connect_errno()){
	    die('Unable to connect!').mysqli_connect_error();
	}

	// 如果$id=-1表示为新文章；否则，查询并覆盖旧文章
	if ($id == -1) {
		$date_created = date('Y-m-d H:i:s',time());
		$sql = 'INSERT articles (author, title, tags, date_created, content) VALUES '.
               '("'.$author.'", "'.$title.'", "'.$tags.'" , "'.$date_created.'", "'.$content.'")';
     $link->query($sql);
	} else {
		$sql = 'UPDATE articles SET title="'.$title.'",tags="'.$tags.'",content="'.$content.'" WHERE id="'.$id.'"';
		$link->query($sql);
	}

	// 更新相关统计信息，如tag等

	//关闭数据库连接
	$link->close();
	echo '{"success":true,"msg":"保存成功"}';
}

function getArticlesByPage() {
  $pageindex = trim($_REQUEST['pageindex']);
  if(!isset($pageindex))
    echo json_encode(error(false, 'pageindex not exist'));

  $link = new mysqli("121.41.119.102", "root", "123456","hansiguai");
	if (mysqli_connect_errno()){
	  die('Unable to connect!').mysqli_connect_error();
	}

	$unit = 2;
	$sql = 'SELECT count(id) FROM articles';
	$pagecount = ceil($link->query($sql)->fetch_array()[0] / $unit);

	$sql = 'SELECT * FROM articles order by date_created desc LIMIT '.$pageindex.','.$unit;
	$query_info = $link->query($sql);
	$articles = array();
	while($article = $query_info->fetch_assoc()) {   
    array_push($articles, $article);
  }

	$link->close();
	$result = json_decode('{}');
	$result->pagecount = $pagecount;
	$result->articles = $articles;
	echo json_encode($result);
}

function getSingleArticleById() {
	$id = trim($_REQUEST['id']);
  if(!isset($id))
    echo json_encode(error(false, 'id not exist'));

  $link = new mysqli("121.41.119.102", "root", "123456","hansiguai");
	if (mysqli_connect_errno()){
	  die('Unable to connect!').mysqli_connect_error();
	}

	$sql = 'SELECT * FROM articles WHERE id="'.$id.'"';
	$query_info = $link->query($sql);
	$articles = array();
	while($article = $query_info->fetch_assoc()) {   
    array_push($articles, $article);
  }

	$link->close();
	echo '{"success":true,"msg":'.json_encode($articles[0]).'}';
}

function deleteSingleArticleById() {
	$id = trim($_REQUEST['id']);
  if(!$id)
    echo json_encode(error(false, 'id not exist'));

  $link = new mysqli("121.41.119.102", "root", "123456","hansiguai");
	if (mysqli_connect_errno()){
	  die('Unable to connect!').mysqli_connect_error();
	}

	$sql = 'DELETE FROM articles WHERE id="'.$id.'"';
	$link->query($sql);

  //关闭数据库连接
	$link->close();
	echo '{"success":true,"msg":"success"}';
}

?>