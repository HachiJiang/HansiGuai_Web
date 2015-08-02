define(function(require, exports, module) {

  require("jquery");
  require("bootstrap");
  var blog = require("blog");

  // 请求加载数据库里的文章
  function loadArticlesByPage(pageindex) {
    $.ajax({
      type: "GET",
      url: "./php/index.php",
      data: {
        event: "_0003",
        pageindex: pageindex
      },
      dataType: "json",
      success: function(data) {
        var permalink_btn = '<div class="post-permalink"><a href="#" class="btn btn-default">阅读全文</a></div>';
        var tmp = $('<div></div>');
        //数据请求成功，获取当前用户所有文章
        var pagecount = data.pagecount;
        var articles = data.articles;
        articles.forEach(function(article) {
          article.date_created = new Date(article.date_created);
          article.tags = article.tags.split(",");
          if (article.content.length > 200) {
            article.content = article.content.substr(0, 200) + " <br>......";
          }
          var article_node = $(blog.parseInputToHTML(article));
          $(article_node).attr("id", article.id);
          $(article_node).find('.post-footer').before(permalink_btn);
          tmp.append(article_node);
        })
        tmp.append('<nav id="post-pagination" class="pagination" role="navigation"><span class="page-number">第 ' + (pageindex+1) + ' 页 ⁄ 共 ' + pagecount + ' 页</span></nav>');
        $('#blog-main').html(tmp.html());
        if (pageindex > 0) {
          $('#post-pagination').prepend('<a id="' + (pageindex - 1) + '" class="newer-posts" href="#"><i class="fa fa-angle-left"></i></a>');
        } 
        if (pageindex < pagecount - 1) {
          $('#post-pagination').append('<a id="' + (pageindex + 1) + '" class="older-posts" href="#"><i class="fa fa-angle-right"></i></a>');
        }
      },
      error: function(jqXHR) {
        //数据请求失败，弹出报错
        alert("连接失败");
      }
    });
  }
  exports.loadArticlesByPage = loadArticlesByPage;

  // 保存单篇文章到数据库
  function saveSingleArticle(article) {
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
          blog.displaySingleArticle(article);
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
  exports.saveSingleArticle = saveSingleArticle;

  // 保存单篇文章到数据库
  function deleteSingleArticle(article_id) {
    $.ajax({
      type: "POST",
      url: "./php/index.php",
      data: {
        event: "_0005",
        id: article_id
      },
      dataType: "json",
      success: function(data) {
        if (data.success) {
          //文章删除成功，返回主页缩略图列表
          loadArticlesByPage(0);
          $('#article-editor').removeClass("active");
          $('#article-single').removeClass("active");
          $('#blog-main #' + article_id).remove();
          $('#isDeleteMsg').modal('hide');
          $('#blog-main').addClass("active");
        } else {
          alert(data.msg);
        }
      },
      error: function(jqXHR) {
        alert("连接失败");
      }
    });
  }
  exports.deleteSingleArticle = deleteSingleArticle;

  function requestSingleArticleToEdit(article_id) {
    $.ajax({
      type: "POST",
      url: "./php/index.php",
      data: {
        event: "_0004",
        id: article_id
      },
      dataType: "json",
      success: function(data) {
        if (data.success) {
          //文章请求成功，将单篇文章加载到编辑页
          var article = data.msg;
          $('#article-editor #article-title').val(article.title);
          $('#article-editor textarea').html(article.content);
          $('#article-tags').empty();
          if (article.tags) {
            var tags = article.tags.split(',');
            for (var i = 0; i < tags.length; i++) {
              $('#article-tags').append('<a class="tag pull-left">' + tags[i] + '</a>');
            }
          }
          $('#article-single').removeClass("active");
          $('#blog-main').removeClass("active");
          $('#article-editor .form-group').attr("id", article_id);
          $('#article-editor').addClass("active");
          $('#article-editor #article-title').focus();
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
  exports.requestSingleArticleToEdit = requestSingleArticleToEdit;

  function requestSingleArticleToDisplay(article_id) {
    $.ajax({
      type: "POST",
      url: "./php/index.php",
      data: {
        event: "_0004",
        id: article_id
      },
      dataType: "json",
      success: function(data) {
        if (data.success) {
          //文章请求成功，将单篇文章加载到单篇显示页
          var article = data.msg;
          article.date_created = new Date(article.date_created);
          article.tags = article.tags.split(",");
          blog.displaySingleArticle(article);
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
  exports.requestSingleArticleToDisplay = requestSingleArticleToDisplay;

  function requestSignout(username) {
    //修改数据库中user状态
    $.ajax({
      type: "POST",
      url: "./php/index.php",
      data: {
        event: "_0001",
        username: username
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
  }
  exports.requestSignout = requestSignout;
})
