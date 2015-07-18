define(function(require, exports, module) {

  require("jquery");
  require("bootstrap");

  // 获取用户输入的文章信息
  function convertArticleContent(content) {

  }

  // 获取用户输入的文章内容并解析成HTML
  function convertInputToHTML() {
    var article = {
      title: $('#article-title').val(),
      tags: $('#article-tag').children('.tag'),
      created_date: new Date(),
      modified_date: "",
      content: convertArticleContent($('#article-content').val())
    };

    article.title = "<div class='post-head'><h1 class='post-title'><a href='#'>"
    + article.title
    +"</a></h1><div class='post-meta'><span class='author'>作者：<a href='#'>"
    + localStorage.getItem("currentUser")
    + "</a></span> &bull;<time class='post-date' datetime='"
    + article.created_date
    + "' title='" + article.created_date + "'>" + article.created_date 
    + "</time></div></div>";

    var article_html = '<article class="post tag-about-ghost tag-release featured">'
    + article.title;

    return article_html;
  }
  exports.convertInputToHTML = convertInputToHTML;

})
