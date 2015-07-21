define(function(require, exports, module) {

  require("jquery");
  require("bootstrap");

  // 验证用户输入是否有效
  function validateArticleInfo(article) {
    if (!article.title) {
      $("#myModalLabel").html("请输入标题");
      $("#notifyMsg").modal();
      return false;
    }

    if (!article.content) {
      $("#myModalLabel").html("请输入文章内容");
      $("#notifyMsg").modal();
      return false;
    }

    return article;
  }

  // 获取用户输入的文章相关内容
  function getArticleInfo() {
    var article = {
      id: -1,
      author: localStorage.getItem("currentUser"),
      title: $('#article-title').val(),
      tags: $('#article-tag-list').children('.tag') || "",
      date_created: new Date(),
      content: parseArticleContent($('#article-content').val())
    };

    if (validateArticleInfo(article) === false) return "";

    var tags = [];
    $.each(article.tags, function(i, tag) {
      tags[i] = tag.text;
    })
    article.tags = tags;

    return article;
  }
  exports.getArticleInfo = getArticleInfo;

  // 解析用户输入的markdown内容
  function parseArticleContent(content) {
    require("marked");
    marked.setOptions({

    });
    return marked(content);
  }

  // 解析时间
  var weekday = {
    /*"0": "Sunday",
    "1": "Monday",
    "2": "Tuesday",
    "3": "Wednesday",
    "4": "Thursday",
    "5": "Friday",
    "6": "Saturday"*/
    "0": "日",
    "1": "一",
    "2": "二",
    "3": "三",
    "4": "四",
    "5": "五",
    "6": "六"
  };

  function parseDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var daytime = date.getDate();
    var day = weekday[date.getDay()];
    var hours = date.getHours();
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return year + "年" + month + "月" + daytime + "日 星期" + day + " " + hours + ":" + minutes;
  }

  // 获取用户输入的文章内容并解析成HTML
  function parseInputToHTML(article) {
    article.date_created_HTML = parseDate(article.date_created);
    article.titleHTML = "<div class='post-head'><h1 class='post-title'><a href='#'>" + article.title + "</a></h1><div class='post-meta'><span class='author'>作者：<a href='#'>" + article.author + "</a></span> &bull;<time class='post-date' datetime='" + article.date_created + "' title='" + article.created_date + "'>" + article.date_created_HTML + "</time></div></div>";

    article.tagHTML = [];
    $.each(article.tags, function(i, tag) {
      article.tagHTML[i] = '<a href="#">' + tag + '</a>';
    });
    article.tagHTML.join(",");

    article.contentHTML = "<section class='post-content'>" + article.content + "</section>";

    return '<article class="post tag-release featured">' + article.titleHTML + article.contentHTML + '<footer class="post-footer clearfix"><div class="pull-left tag-list"><i class="fa fa-folder-open-o"></i>' + article.tagHTML + '</div></footer>' + '</article>';
  }
  exports.parseInputToHTML = parseInputToHTML;

  // 文章转换为单篇显示
  function displaySingleArticle(article_node) {
    article_node.append('<btn class="pull-right" id="back-to-blog-main-btn"><a href="#">→博客主页</a></btn>');
    $('.article-single').html(article_node);
    $('#article-editor').removeClass("active");
    $('#blog-main').removeClass("active");
    $('.article-single').addClass("active");
  }
  exports.displaySingleArticle = displaySingleArticle;
})
