'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const category = require(`./category`);
const CategoryService = require(`../data-service/category`);

const { HttpCode } = require(`../../constants`);
const { mockArticles } = require(`../mocks/articles`);
const { mockCategories } = require(`../mocks/category`);
const { mockUsers } = require(`../mocks/users`);


const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, { logging: false });
  await initDB(mockDB, { categories: mockCategories, articles: mockArticles, users: mockUsers });

  const app = express();
  app.use(express.json());

  category(app, new CategoryService(mockDB));

  return app;
};

describe(`API CATEGORY`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/categories`);

  });

  test(`Returns 200 status code for correct request`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns correct categories length`, () =>
    expect(response.body.length).toBe(mockCategories.length));

  test(`Articles contains correct categories`, () =>
    expect(response.body.map((item) => item.name)).toEqual(expect.arrayContaining(mockCategories)));
});
