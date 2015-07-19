define(function(require, exports, module) {

  require("jquery");
  require("bootstrap");

  $(function() {
    //全局变量
    var active_href = $("#menu-nav li.active a").attr("href");

    // 为关闭warning窗口绑定事件：转向登陆页
    $('#warningMsg').on('hide.bs.modal', function() {
      location.href = "index.html";
    });
    // 读取session中用户信息，session验证失败则转至登陆页
    var username = localStorage.getItem("currentUser");
    if (!username) {
      $("#myModalLabel").html("Warning: 请先登录!");
      $("#notifyMsg").modal({
        keyboard: false
      });
      return;
    }

    // 用户存在则展示当前用户内容
    $("#user").html("Welcome, <strong>" + username + "</strong>!");
    // 加载数据库里的文章
    $.ajax({
      type: "GET",
      url: "./php/index.php",
      data: {
        event: "_0003",
        author: username
      },
      dataType: "json",
      success: function(data) {
        //数据请求成功，获取当前用户所有文章
        
      },
      error: function(jqXHR) {
        //数据请求失败，弹出报错
        alert("连接失败");
      }
    });

    // 切换页面分区事件
    $("#menu-nav .navbar-collapse li").click(function(e) {
      var href = $(this).children("a").attr('href');

      if ('#' !== href) {
        e.preventDefault();
        $("#menu-nav li.active").removeClass("active");
        $("#content-wrap .sub-section" + active_href).removeClass("active");
        $(this).addClass("active");
        active_href = href;
        $("#content-wrap .sub-section" + active_href).addClass("active");
      }
    });

    // sign out事件
    $("#signOut").click(function() {
      var currentUser = localStorage["currentUser"];
      //修改数据库中user状态
      $.ajax({
        type: "POST",
        url: "./php/index.php",
        data: {
          event: "_0001",
          username: currentUser
        },
        dataType: "json",
        success: function(data) {
          if (data.success) {
            //数据请求成功，且验证成功，跳转回登录页面
            location.href = "index.html";
            localStorage.clear();
          } else {
            //数据请求成功，但验证失败
            alert(data.msg);
          }
        },
        error: function(jqXHR) {
          //数据请求失败，弹出报错
          alert("连接失败");
        }
      });
    });

    var blog = require("blog");

    // 显示文章编辑窗口区域
    $('#article-create-btn').on('click', function() {
      // 初始化input节点
      $('#article-title').val("");
      $('#article-content').html("");
      $('#article-tags').empty();

      $('.article-single').removeClass("active");
      $('#blog-main').removeClass("active");
      $('#article-editor').addClass("active");
    });

    // 退出编辑，重新显示主页文章列表区域
    $('#exit-editor-btn').on('click', function() {
      $('#blog-main').addClass("active");
      $('#article-editor').removeClass("active");
    });

    // 预览文章，弹出模态框
    $('#article-preview').on('click', function() {
      var article = blog.getArticleInfo();
      if (article === "") return;

      var articleHTML = blog.parseInputToHTML(article);
      $('#article-preview-dialog').find('.modal-body').html(articleHTML);
      $('#article-preview-dialog').modal();
    });

    // 保存文章，页面跳转显示正文全文
    $('#save-article-btn').on('click', function() {
      var article = blog.getArticleInfo();
      if (article === "") return;

      $("#notifyMsg").modal();
      $("#myModalLabel").html("正在保存...");
      $.ajax({
        type: "POST",
        url: "./php/index.php",
        data: {
          event: "_0002",
          id: article.id,
          author: "guai",
          title: article.title,
          tags: article.tags.join(","),
          content: article.content
        },
        dataType: "json",
        success: function(data) {
          if (data.success) {
            //文章保存成功，显示整篇文章
            var article_node = $(blog.parseInputToHTML(article));
            article_node.append('<btn class="pull-right" id="back-to-blog-main-btn"><a href="#">→博客主页</a></btn>');
            $('.article-single').html(article_node);
            $('#article-editor').removeClass("active");
            $('#blog-main').removeClass("active");
            $('.article-single').addClass("active");
            $("#myModalLabel").modal("hide");
          } else {
            //数据请求成功，但验证失败
            alert(data.msg);
          }
        },
        error: function(jqXHR) {
          //数据请求失败，弹出报错
          alert("连接失败");
        }
      });
    });

    // 返回博客主页
    $('.article-single').on('click', '#back-to-blog-main-btn', function() {
      $('.article-single').removeClass("active");
      $('#blog-main').addClass("active");
    });

  });
});
