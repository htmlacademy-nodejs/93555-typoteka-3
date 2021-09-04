'use strict';

const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search`);
const SearchService = require(`../data-service/search`);

const { HttpCode } = require(`../../constants`);
const { mockArticle, mockArticles } = require(`../mocks/articles`);

const createAPI = () => {
  const app = express();
  app.use(express.json());

  search(app, new SearchService(mockArticles));

  return app;
};

describe(`API SEARCH`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/search`).query({
      query: `прог`
    });
  });

  test(`Returns 200 status code for correct request`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns correct search result length`, () =>
    expect(response.body.length).toBe(2));

  test(`Result array has correct id`, () =>
    expect(response.body.shift().id).toBe(mockArticle.id));

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
