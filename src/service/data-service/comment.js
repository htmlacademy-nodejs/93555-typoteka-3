'use strict';

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
  }


  async create(articleId, comment) {
    return await this._Comment.create({
      articleId,
      ...comment
    });
  }

  async remove(id) {
    const deletedRows = await this._Comment.destroy({
      where: { id }
    });

    return !!deletedRows;
  }

  findAll(articleId) {
    return this._Comment.findAll({
      where: { articleId },
      raw: true
    });
  }

}

module.exports = CommentService;
