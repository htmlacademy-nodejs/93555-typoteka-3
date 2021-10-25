"use strict";

const { format, parse } = require(`date-fns`);

module.exports.transformArticle = (article) => {
  const date = new Date(article.createdAt);

  return {
    ...article,
    datetime: format(date, `yyyy-MM-ddTHH:mm`),
    date: format(date, `dd.MM.yyyy, HH:mm`),
  };
};

module.exports.transformComments = (article) => {
  return article.comments.map((comment) => ({
    ...comment,
    articleId: article.id,
    articleTitle: article.title,
  }));
};

module.exports.parseCreatedArticle = ({ body, file = {} }) => {
  const createdDate = body.date
    ? parse(body.date, `dd.MM.yyyy`, new Date())
    : new Date();

  const isValid = [body.title, body.announce, body.fullText, createdDate].every(Boolean);

  if (!isValid) {
    return undefined;
  }

  const article = {
    title: body.title,
    announce: body.announce,
    fullText: body.fullText,
    createdDate,
    categories: body.categories || [],
  };

  if (file.filename) {
    article.picture = file.filename;
  }

  return article;
};
