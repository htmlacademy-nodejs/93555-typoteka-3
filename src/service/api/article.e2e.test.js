"use strict";

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./article`);
const ArticleService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);

const { HttpCode } = require(`../../constants`);
const { mockArticle, mockArticles } = require(`../mocks/articles`);

const createAPI = () => {
  const clonedData = JSON.parse(JSON.stringify(mockArticles));

  const app = express();
  app.use(express.json());

  article(app, new ArticleService(clonedData), new CommentService());

  return app;
};

const validArticle = {
  title: `Ёлки`,
  announce: `Планируете записать видосик на эту тему? Мне не нравится ваш стиль. Ощущение что вы меня поучаете. Хочу такую же футболку :-)`,
  fullText: `Первая большая ёлка была установлена только в 1938 году. Как начать действовать? Для начала просто соберитесь.`,
  createdDate: `2021-09-03 23:52:05`,
  categories: [
    "Как достигнуть успеха не вставая с кресла",
    "Как перестать беспокоиться и начать жить",
  ],
};

const invalidArticle = {
  title: `Ёлки`,
  announce: `Планируете записать видосик на эту тему? Мне не нравится ваш стиль. Ощущение что вы меня поучаете. Хочу такую же футболку :-)`,
  fullText: `Первая большая ёлка была установлена только в 1938 году. Как начать действовать? Для начала просто соберитесь.`,
};

describe(`API ARTICLE: GET MANY`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles`);
  });

  test(`Returns 200 status code for correct request`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns correct articles length`, () =>
    expect(response.body.length).toBe(mockArticles.length));

  test(`First article contains target id`, () =>
    expect(response.body.shift().id).toBe(mockArticle.id));
});

describe(`API ARTICLE: GET ONE`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/${mockArticle.id}`);
  });

  test(`Returns 200 status code for correct request`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article contains correct title`, () =>
    expect(response.body.title).toBe(mockArticle.title));
});

describe(`API ARTICLE: CREATE ONE`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/articles`).send(validArticle);
  });

  test(`Returns 200 status code for correct request`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns article created`, () =>
    expect(response.body).toEqual(expect.objectContaining(validArticle)));

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
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/${mockArticle.id}`)
      .send(validArticle);
  });

  test(`Returns 200 status code for correct request`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () =>
    expect(response.body).toEqual(expect.objectContaining(validArticle)));

  test(`Article is really changed`, () =>
    request(app)
      .get(`/articles/${mockArticle.id}`)
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
      .put(`/articles/${mockArticle.id}`)
      .send(invalidArticle)
      .expect(HttpCode.BAD_REQUEST));

  test(`Returns empty object in body for invalid request body`, () =>
    request(app)
      .put(`/articles/${mockArticle.id}`)
      .send(invalidArticle)
      .expect((res) => expect(res.body).toEqual({})));
});

describe(`API ARTICLE: DELETE`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/${mockArticle.id}`);
  });

  test(`Returns 200 status code for correct request`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns correct deleted article id`, () =>
    expect(response.body.id).toBe(mockArticle.id));

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
