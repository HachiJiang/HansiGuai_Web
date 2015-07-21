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

    // 用户存在则展示当前用户内容
    $("#user").html("Welcome, <strong>" + username + "</strong>!");

    var XHRs = require('XHRs');
    XHRs.loadAllArticles(username);

    // 显示文章编辑窗口区域
    $('#article-create-btn').on('click', function() {
      // 初始化input节点
      $('#article-title').val("");
      $('#article-content').val("");
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

      XHRs.loadSingleArticle(article);
    });

    // 返回博客主页
    $('.article-single').on('click', '#back-to-blog-main-btn', function() {
      XHRs.loadAllArticles(username);
      $('.article-single').removeClass("active");
      $('#blog-main').addClass("active");
    });

    // 阅读全文
    $('#blog-main').on('click', '.post-permalink a', function() {
      var article_node = $(this).parents('article').clone();
      $(article_node).find('.post-permalink').remove();
      $(article_node).find('.post-permalink').remove();
      blog.displaySingleArticle(article_node);
    });
  });
});
