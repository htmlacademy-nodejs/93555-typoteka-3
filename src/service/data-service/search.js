'use strict';

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll(searchText) {
    const normalized = searchText.trim().toLowerCase();

    return this._articles.filter((article) => article.title.toLowerCase().includes(normalized));
  }

}

module.exports = SearchService;
