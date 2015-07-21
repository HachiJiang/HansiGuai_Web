define(function(require, exports, module) {

  require("jquery");
  require("bootstrap");
  var blog = require("blog");

  // 请求加载数据库里的文章
  function loadAllArticles(username) {
    $.ajax({
      type: "GET",
      url: "./php/index.php",
      data: {
        event: "_0003",
        author: username
      },
      dataType: "json",
      success: function(data) {
        var permalink_btn = '<div class="post-permalink"><a href="#" class="btn btn-default">阅读全文</a></div>';
        var tmp = $('<div></div>');
        //数据请求成功，获取当前用户所有文章
        for (var i = data.length - 1; i >= 0; i--) {
          var article = data[i];
          article.date_created = new Date(article.date_created);
          article.tags = article.tags.split(",");
          var article_node = $(blog.parseInputToHTML(article));
          $(article_node).attr("id", article.id);
          $(article_node).find('.post-footer').before(permalink_btn);
          tmp.append(article_node);
        };
        tmp.append('<nav class="pagination" role="navigation"><span class="page-number">第 1 页 ⁄ 共 7 页</span><a class="older-posts" href="/page/2/"><i class="fa fa-angle-right"></i></a></nav>');
        $('#blog-main').html(tmp.html());
      },
      error: function(jqXHR) {
        //数据请求失败，弹出报错
        alert("连接失败");
      }
    });
  }
  exports.loadAllArticles = loadAllArticles;

  function loadSingleArticle(article) {
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
          blog.displaySingleArticle(article_node);
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
  }
  exports.loadSingleArticle = loadSingleArticle;
})
