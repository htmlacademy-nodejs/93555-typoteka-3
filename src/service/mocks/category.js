const { mockArticles } = require('./articles')

const mockCategories = [...new Set(mockArticles.flatMap(item => item.category))]

module.exports = { mockCategories }
