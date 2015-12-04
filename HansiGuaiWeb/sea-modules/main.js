define(function(require, exports, module) {

  require("jquery");
  require("bootstrap");

  $(function() {
    //全局变量
    var active_href = $("#menu-nav li.active a").attr("href");

    // 为关闭warning窗口绑定事件：转向登陆页
    $('#notifyMsg').on('hide.bs.modal', function() {
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
      XHRs.requestSignout(currentUser);
    });

    var blog = require("blog");

    // 用户存在则展示当前用户内容
    $("#user").html("Welcome, <strong>" + username + "</strong>!");

    var curpageindex = 0;
    var XHRs = require('XHRs');
    XHRs.loadArticlesByPage(0);

    // 上一页
    $('#blog-main').on('click', '.newer-posts', function() {
      $('#blog-main').empty();
      curpageindex--;
      XHRs.loadArticlesByPage(curpageindex);
    });

    // 下一页
    $('#blog-main').on('click', '.older-posts', function() {
      $('#blog-main').empty();
      curpageindex++;
      XHRs.loadArticlesByPage(curpageindex);
    });


    // 显示文章编辑窗口区域 - 新文章
    $('.widget').on('click', '#article-create-btn', function() {
      // 初始化input节点
      $('#article-title').val("");
      $('#article-content').val("");
      $('#article-tags').empty();
      $('#article-editor form').removeAttr('id');

      $('#article-single').removeClass("active");
      $('#blog-main').removeClass("active");
      $('#article-editor').addClass("active");
      $('#article-editor #article-title').focus();
    });

    // 退出编辑，重新显示主页文章列表区域
    $('#article-editor').on('click', '#exit-editor-btn', function() {
      $('#article-editor').removeClass("active");
      if ($('#article-editor form').attr('id')) {
        $('#article-single').addClass("active");
      } else {
        $('#blog-main').addClass("active");
      }
    });

    // 点击 添加标签
    $('#article-editor').on('click', '#add-tag-btn a', function() {
      if ($('#article-tags input').length > 0) return;
      var tag_input = $('<input type="text" class="tag pull-left"></input>');
      $('#article-tags').prepend(tag_input);
      $(tag_input).focus();
    });

    // 输入标签转为a
    $('#article-editor').on('keydown', '#article-tags input', function(e) {
      if (e.which === 13) {
        e.preventDefault();
        var tag_node = $('<a class="tag pull-left"></a>');
        $(tag_node).text(this.value);
        $('#article-editor #article-tags input').remove();
        $('#article-tags').prepend(tag_node);
      }
    });

    // 预览文章，弹出模态框
    $('#article-editor').on('click', '#article-preview', function() {
      var article = blog.getArticleInfo();
      if (article === "") return;

      var articleHTML = blog.parseInputToHTML(article);
      var preview_dialog = $('#article-preview-dialog');
      preview_dialog.find('.modal-body').html(articleHTML);
      preview_dialog.modal();
    });

    // 保存文章，页面跳转显示正文全文
    $('#article-editor').on('click', '#save-article-btn', function() {
      var article = blog.getArticleInfo();
      if (article === "") return;

      XHRs.saveSingleArticle(article);
    });

    // 返回博客主页
    $('#article-single').on('click', '#back-to-blog-main-btn', function() {
      $('#article-single').removeClass("active");
      XHRs.loadArticlesByPage(0);
      $('#blog-main').addClass("active");
    });

    // 删除文章
    $('#article-single').on('click', '#delete-article-btn', function() {
      var article_id = $(this).parents('article').attr('id');
      $('#isDeleteMsg').modal();
      $('#isDeleteMsg .btn-confirm').attr('id', article_id);
    });

    // 确认删除文章
    $('#isDeleteMsg').on('click', '.btn-confirm', function() {
      var article_id = $(this).attr('id');
      XHRs.deleteSingleArticle(article_id);
    });

    // 请求单篇文章，阅读全文
    $('#blog-main').on('click', '.post-permalink a', function() {
      var article_id = $(this).parents('article').attr('id');
      XHRs.requestSingleArticleToDisplay(article_id);
    });

    // 单篇文章，点击标题进入编辑模式
    $('#article-single').on('click', '.post-title a', function() {
      // 请求单篇文章数据，并加载到编辑页
      var article_id = $(this).parents('article').attr('id');
      XHRs.requestSingleArticleToEdit(article_id);
    });

    // 编辑模式下，标签mouse over时浮动删除icon
    $('#article-editor').on('mouseenter', '.tag', function() {
      $(this).append('<i class="fa fa-times"></i>');
    });
    $('#article-editor').on('mouseleave', '.tag', function() {
      $(this).find('.fa-times').remove();
    });

    // 编辑模式下，点击标签的删除icon
    $('#article-editor').on('click', '.fa-times', function() {
      $(this).parents('.tag').remove();
    });

    // 编辑模式下，点击图片icon 插入图片
    $('#article-editor').on('click', '#btn-article-pic', function() {
      $('#upload-file-dialog').modal({
        keyboard: false
      });
    });

    // 显示前重置上传表单
    $('#upload-file-dialog').on('hidden.bs.modal', function() {
      $(this).find('#upload-img').val("");
      $(this).find('#input-img-links').val("");
    });

    // 上传文件时，显示文件列表
    $('#upload-file-dialog').on('change', '#upload-img', function() {
      var files = $(this).prop('files');
      var len = files.length;
      var filenames = files[0].name;
      for (var i = 1; i < len; i++) {
        filenames += ";" + files[i].name;
      }
      $('#input-img-links').val(filenames);
    });

    require("jquery-extend");
    
    // 生成文件链接内容
    $('#upload-file-dialog').on('click', '#btn-upload-img', function() {
      var files = $('#upload-img').prop('files');
      var len = files.length;
      if (len === 0) {
        $('#upload-file-dialog .modal-body').append('<p>未上传任何文件</p>');
        return;
      }

      var imgHTML = "";
      for (var i = 0; i < len; i++) {
        imgHTML += '![Alt text](./static/images/' + username + '/' + new Date().getTime() + '_' + files[i].name + ')\n';
      }

      var contentnode = $('#article-content');
      var content = blog.insertAtPos(contentnode.val(), imgHTML, contentnode.getCurPos());
      contentnode.val(content);
      $('#upload-file-dialog').modal('hide');
    });

  });
});
