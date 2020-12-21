let loadedXML;
var xmlhttp = new XMLHttpRequest();
const loadXML = (callBack) => {
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callBack(this.responseXML);
    }
  };
  xmlhttp.open("GET", "./articles.xml", true);
  xmlhttp.send();
};

const getXML = (XML) => {
  loadedXML = XML;
};

const getTagAndAttr = (item, tagName, Attribute) => {
  let tags = item.getElementsByTagName(tagName);
  let tagAndAttr = [];
  for (let tag of tags) {
    tagAndAttr.push({
      attr: tag.getAttribute(Attribute),
      value: tag.innerHTML,
    });
  }

  return tagAndAttr;
};

const insertPostId = (XML) => {
  let blog = XML.getElementsByTagName("blog")[0];
  let articles = getTagAndAttr(blog, "article", "id");
  const posts_id = document.getElementById("posts_id");
  posts_id.innerHTML = "";

  articles.map((article) => {
    let option = document.createElement("option");
    option.textContent = article.attr;
    option.value = article.attr;
    posts_id.appendChild(option);
  });
};

const getArticle = (articles, articleID) => {
  let curArticle;
  articles = [...articles];
  articles.map((article) => {
    if (article.getAttribute("id") == articleID) {
      curArticle = article;
    }
  });
  return curArticle;
};

const getArticleTags = (article, tagName) => {
  let tags = [];
  [...article.getElementsByTagName(tagName)].map((tag) => {
    tags.push({
      language: tag.getAttribute("language"),
      titleText: tag.textContent,
    });
  });
  return tags;
};

const insertArticleTitle = (titles) => {
  const posts_lang = document.getElementById("posts_lang");

  titles.map((title) => {
    let option = document.createElement("option");
    option.textContent = title.language + "<----->" + title.titleText;
    option.value = title.language;
    posts_lang.appendChild(option);
  });
};

const getTagByLang = (article, language, tagName) => {
  let mainTitle;
  getArticleTags(article, tagName).map((title) => {
    if (title.language === language || title.language === null) {
      mainTitle = title.titleText;
    }
  });

  return mainTitle;
};

const setDivContent = (article, language, divID, TagName) => {
  let divTitel = document.getElementById(divID);
  divTitel.textContent = getTagByLang(article, language, TagName);
};
const showArticle = (article, language) => {
  setDivContent(article, language, "atitle", "title");
  setDivContent(article, language, "acontent", "content");
  setDivContent(article, language, "akeywords", "keywords");
  setDivContent(article, language, "aname", "author");
  setDivContent(article, language, "aemail", "email");
};

loadXML(getXML);
document.addEventListener("DOMContentLoaded", () => {
  const postIDSelect = document.getElementById("posts_id");
  const postLangSelect = document.getElementById("posts_lang");
  setTimeout(() => {
    insertPostId(loadedXML);

    const firstID = postIDSelect.firstChild.textContent;

    let article = getArticle(
      loadedXML.getElementsByTagName("article"),
      firstID
    );
    let titles = getArticleTags(article, "title");
    insertArticleTitle(titles);

    const firstLang = postLangSelect.firstChild.value;

    showArticle(article, firstLang);
  }, 1000);

  postIDSelect.addEventListener("change", (e) => {
    postLangSelect.innerHTML = "";
    const SelectedId = e.target.value;

    let article = getArticle(
      loadedXML.getElementsByTagName("article"),
      SelectedId
    );
    let titles = getArticleTags(article, "title");
    insertArticleTitle(titles);

    const firstLang = postLangSelect.firstChild.value;

    showArticle(article, firstLang);
  });

  postLangSelect.addEventListener("change", (e) => {
    const SelectedId = postIDSelect.value;
   
    let article = getArticle(
      loadedXML.getElementsByTagName("article"),
      SelectedId
    );

    const firstLang = postLangSelect.value;

    showArticle(article, firstLang);
  });
});
