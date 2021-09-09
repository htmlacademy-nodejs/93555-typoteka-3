const { mockArticles } = require('./articles')

const mockCategories = [...new Set(mockArticles.flatMap(item => item.categories))]

module.exports = { mockCategories }
