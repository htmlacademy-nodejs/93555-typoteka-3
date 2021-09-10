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
    try {
      return this._request(`/articles`);
    } catch (error) {
      console.log(`ERROR: Get articles`);
      return [];
    }
  }

  getArticle(id) {
    try {
      return this._request(`/articles/${id}`);
    } catch (error) {
      console.log(`ERROR: Get article`);
      return {};
    }
  }

  searchArticles(query) {
    try {
      return this._request(`/search`, { params: { query } });
    } catch (error) {
      console.log(`ERROR: Search articles`);
      return [];
    }
  }

  async getCategories() {
    try {
      return this._request(`/categories`);
    } catch (error) {
      console.log(`ERROR: Get categories`);
      return [];
    }
  }

  async createArticle(data) {
    try {
      return this._request(`/articles`, {
        method: `POST`,
        data,
      });
    } catch (error) {
      throw new Error(`ERROR: Create article`);
    }
  }
}

const api = new Api(defaultUrl, TIMEOUT);

module.exports = {
  api,
};
