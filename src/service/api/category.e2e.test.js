'use strict';

const express = require(`express`);
const request = require(`supertest`);

const category = require(`./category`);
const CategoryService = require(`../data-service/category`);

const { HttpCode } = require(`../../constants`);
const { mockArticles } = require(`../mocks/articles`);
const { mockCategories } = require(`../mocks/category`);

const createAPI = () => {
  const app = express();
  app.use(express.json());

  category(app, new CategoryService(mockArticles));

  return app;
};

describe(`API CATEGORY`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/categories`);

  });

  test(`Returns 200 status code for correct request`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns correct categories length`, () =>
    expect(response.body.length).toBe(mockCategories.length));

  test(`Articles contains correct categories`, () =>
    expect(response.body).toEqual(expect.arrayContaining(mockCategories)));
});
