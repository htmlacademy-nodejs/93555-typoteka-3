"use strict";

const Aliase = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async remove(id) {
    const deletedRows = await this._Article.destroy({
      where: { id }
    });
    return Boolean(deletedRows);
  }

  async findAll(needComments) {
    const include = [Aliase.CATEGORIES];

    if (needComments) {
      include.push(Aliase.COMMENTS);
    }

    const articles = await this._Article.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    return articles.map((item) => item.get());
  }

  async findOne(id) {
    return await this._Article.findByPk(id, { include: [Aliase.CATEGORIES, Aliase.COMMENTS] });
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: { id }
    });
    return !!affectedRows;
  }
}

module.exports = ArticleService;
