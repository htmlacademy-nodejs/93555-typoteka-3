"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const article = require(`./article`);
const ArticleService = require(`../data-service/article`);


const { HttpCode } = require(`../../constants`);
const { mockArticle, mockArticles } = require(`../mocks/articles`);
const { mockCategories } = require(`../mocks/category`);
const { mockUsers } = require(`../mocks/users`);

const validArticle = {
  title: `Ёлки`,
  announce: `Планируете записать видосик на эту тему? Мне не нравится ваш стиль`,
  fullText: `Первая большая ёлка была установлена только в 1938 году. Как начать действовать? Для начала просто соберитесь.`,
  categories: [1, 2],
  userId: 1
};

const invalidArticle = {
  title: `Ёлки`,
  announce: `Планируете записать видосик на эту тему? Мне не нравится ваш стиль. Ощущение что вы меня поучаете. Хочу такую же футболку :-)`,
  fullText: `Первая большая ёлка была установлена только в 1938 году. Как начать действовать? Для начала просто соберитесь.`,
};

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, { logging: false });
  await initDB(mockDB, { categories: mockCategories, articles: mockArticles, users: mockUsers });

  const app = express();
  app.use(express.json());

  article(app, new ArticleService(mockDB));

  return app;
};

describe(`API ARTICLE: GET MANY`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/articles?comments=true`);
  });

  test(`Returns 200 status code for correct request`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns correct articles length`, () =>
    expect(response.body.length).toBe(mockArticles.length));

  test(`First article contains target id`, () =>
    expect(response.body.shift().title).toBe(mockArticle.title));
});

describe(`API ARTICLE: GET ONE`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/articles/1`);
  });

  test(`Returns 200 status code for correct request`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article contains correct title`, () =>
    expect(response.body.title).toBe(mockArticle.title));
});

describe(`API ARTICLE: CREATE ONE`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles`).send(validArticle);
  });

  test(`Returns 201 status code for correct request`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Comments have increased by one`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(mockArticles.length + 1)));

  test(`Returns 400 status code for invalid request body`, () =>
    request(app)
      .post(`/articles`)
      .send(invalidArticle)
      .expect(HttpCode.BAD_REQUEST));

  test(`Returns empty object in body for invalid request body`, () =>
    request(app)
      .post(`/articles`)
      .send(invalidArticle)
      .expect((res) => expect(res.body).toEqual({})));
});

describe(`API ARTICLE: UPDATE ONE`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/1`)
      .send(validArticle);
  });

  test(`Returns 200 status code for correct request`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article is really changed`, () =>
    request(app)
      .get(`/articles/1`)
      .expect((res) => expect(res.body.title).toBe(validArticle.title)));

  test(`Returns 404 status code for invalid article id`, () =>
    request(app)
      .put(`/articles/NOEXST`)
      .send(validArticle)
      .expect(HttpCode.NOT_FOUND));

  test(`Returns empty object in body for invalid article id`, () =>
    request(app)
      .post(`/articles/NOEXST`)
      .send(validArticle)
      .expect((res) => expect(res.body).toEqual({})));

  test(`Returns 400 status code for invalid request body`, () =>
    request(app)
      .put(`/articles/1`)
      .send(invalidArticle)
      .expect(HttpCode.BAD_REQUEST));

  test(`Returns empty object in body for invalid request body`, () =>
    request(app)
      .put(`/articles/${mockArticle.id}`)
      .send(invalidArticle)
      .expect((res) => expect(res.body).toEqual({})));
});

describe(`API ARTICLE: DELETE`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/1`);
  });

  test(`Returns 200 status code for correct request`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns correct deleted article id`, () =>
    expect(response.body.result).toBe(true));

  test(`Articles decreased by one`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(mockArticles.length - 1)));

  test(`Returns 404 status code for invalid article id`, () =>
    request(app).delete(`/articles/NOEXST`).expect(HttpCode.NOT_FOUND));

  test(`Returns empty object in body for invalid article id`, () =>
    request(app)
      .delete(`/articles/NOEXST`)
      .expect((res) => expect(res.body).toEqual({})));
});
