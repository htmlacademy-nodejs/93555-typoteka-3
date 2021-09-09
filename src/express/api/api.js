"use strict";

const axios = require(`axios`);

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

class Api {
  constructor(baseURL, timeout) {
    this._client = axios.create({
      baseURL,
      timeout,
    });
  }

  async _request(url, options) {
    const response = await this._client.request({ url, ...options });
    return response.data;
  }

  getArticles() {
    return this._request(`/articles`);
  }

  getArticle(id) {
    return this._request(`/articles/${id}`);
  }

  searchArticles(query) {
    return this._request(`/search`, { params: { query } });
  }

  async getCategories() {
    return this._request(`/categories`);
  }

  async createArticle(data) {
    return this._request(`/articles`, {
      method: `POST`,
      data,
    });
  }
}

const api = new Api(defaultUrl, TIMEOUT);

module.exports = {
  api,
};
