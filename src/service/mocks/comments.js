const { mockArticle, mockArticles } = require("./articles");

const mockComments = mockArticles.find((item) => item.id === mockArticle.id).comments;
const [mockComment] = mockComments;

module.exports = { mockComment, mockComments };
