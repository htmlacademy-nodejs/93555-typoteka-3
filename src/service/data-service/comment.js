'use strict';

const { nanoid } = require(`nanoid`);
const { MAX_ID_LENGTH } = require(`../../constants`);

class CommentService {
  create(article, comment) {
    const newComment = Object.assign({ id: nanoid(MAX_ID_LENGTH) }, comment);

    article.comments.push(newComment);

    return newComment;
  }

  remove(article, commentId) {
    const removedComment = article.comments.find((item) => item.id === commentId);

    if (!removedComment) {
      return null;
    }

    article.comments = article.comments.filter((item) => item.id !== commentId);

    return removedComment.id;
  }

  findAll(article) {
    return article.comments;
  }

}

module.exports = CommentService;
