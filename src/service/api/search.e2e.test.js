'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const search = require(`./search`);
const SearchService = require(`../data-service/search`);

const { HttpCode } = require(`../../constants`);
const { mockArticles, mockArticle } = require(`../mocks/articles`);
const { mockCategories } = require(`../mocks/category`);
const { mockUsers } = require(`../mocks/users`);

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, { logging: false });
  await initDB(mockDB, { categories: mockCategories, articles: mockArticles, users: mockUsers });

  const app = express();
  app.use(express.json());

  search(app, new SearchService(mockDB));

  return app;
};

describe(`API SEARCH`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/search`).query({
      query: `Прог`
    });
  });

  test(`Returns 200 status code for correct request`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns correct search result length`, () =>
    expect(response.body.length).toBe(1));

  test(`Result array has correct id`, () =>
    expect(response.body.shift().title).toBe(mockArticle.title));

  test(`Returns status code 404 for not found`, () =>
    request(app).get(`/search`).query({ query: `помидор` }).expect(HttpCode.NOT_FOUND)
  );

  test(`Returns an empty array for not found`, () =>
    request(app).get(`/search`).query({ query: `помидор` }).expect((res) => expect(res.body.length).toBe(0))
  );

  test(`Returns status code 400 for empty query`, () =>
    request(app).get(`/search`).expect(HttpCode.BAD_REQUEST)
  );

  test(`Returns an empty array for bad request`, () =>
    request(app).get(`/search`).expect((res) => expect(res.body.length).toBe(0))
  );
});
