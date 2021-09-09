"use strict";

const { nanoid } = require(`nanoid`);
const { MAX_ID_LENGTH } = require(`../../constants`);

class ArticleService {
  constructor(articles) {
    this._articles = articles;
  }

  create(article) {
    const newarticle = Object.assign(
      { id: nanoid(MAX_ID_LENGTH), comments: [] },
      article
    );

    this._articles.push(newarticle);

    return newarticle;
  }

  remove(id) {
    this._articles = this._articles.filter((item) => item.id !== id);

    return id;
  }

  findAll() {
    return this._articles;
  }

  findOne(id) {
    return this._articles.find((item) => item.id === id);
  }

  update(id, article) {
    const oldarticle = this._articles.find((item) => item.id === id);

    return Object.assign(oldarticle, article);
  }
}

module.exports = ArticleService;
