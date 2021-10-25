'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const comments = require(`./comments`);
const ArticleService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);

const { HttpCode } = require(`../../constants`);
const { mockArticles } = require(`../mocks/articles`);
const { mockComment, mockComments } = require(`../mocks/comments`);
const { mockCategories } = require(`../mocks/category`);
const { mockUsers } = require(`../mocks/users`);


const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, { logging: false });
  await initDB(mockDB, { categories: mockCategories, articles: mockArticles, users: mockUsers });

  const app = express();
  app.use(express.json());

  comments(app, new ArticleService(mockDB), new CommentService(mockDB));

  return app;
};

describe(`API COMMENTS: GET`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/articles/1/comments`);
  });

  test(`Returns 200 status code for correct request`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns correct length for comment list`, () =>
    expect(response.body.length).toBe(mockComments.length));

  test(`Return correct id for mock comment`, () =>
    expect(response.body.shift().text).toBe(`Мне не нравится ваш стиль. Ощущение что вы меня поучаете.`));
});


describe(`API COMMENTS: CREATE`, () => {
  const newComment = { text: `Мне кажется или я уже читал это где-то?` };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles/1/comments`).send(newComment);
  });

  test(`Returns 201 status code for correct request`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns created comment`, () =>
    expect(response.body).toEqual(expect.objectContaining(newComment)));

  test(`Comments count is changed`, () =>
    request(app).get(`/articles/1/comments`).expect((res) => expect(res.body.length).toBe(mockComments.length + 1)));

  test(`Returns 404 status code for invalid article id`, () =>
    request(app).post(`/articles/NOEXST/comments`).send(newComment).expect(HttpCode.NOT_FOUND));

  test(`Returns empty object in body for invalid article id`, () =>
    request(app).post(`/articles/NOEXST/comments`).send(newComment).expect((res) => expect(res.body).toEqual({})));

  test(`Returns 400 status code for invalid request body`, () =>
    request(app).post(`/articles/1/comments`).send({}).expect(HttpCode.BAD_REQUEST));

  test(`Returns empty object in body for invalid request body`, () =>
    request(app).post(`/articles/1/comments`).send({}).expect((res) => expect(res.body).toEqual({})));
});


describe(`API COMMENTS: DELETE`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/1/comments/1`);
  });

  test(`Returns 200 status code for correct request`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns correct deleted comment id`, () =>
    expect(response.body.id).toBe(mockComment.id));

  test(`Comments decreased by one`, () =>
    request(app).get(`/articles/1/comments`).expect((res) => expect(res.body.length).toBe(mockComments.length - 1))
  );

  test(`Returns 404 status code for invalid comment id`, () =>
    request(app).delete(`/articles/1/comments/NOEXST`).expect(HttpCode.NOT_FOUND));

  test(`Returns empty object in body for invalid comment id`, () =>
    request(app).delete(`/articles/1/comments/NOEXST`).expect((res) => expect(res.body).toEqual({})));

  test(`Returns 404 status code for invalid comment id`, () =>
    request(app).delete(`/articles/NOEXST/comments/10`).expect(HttpCode.NOT_FOUND));

  test(`Returns empty object in body for invalid comment id`, () =>
    request(app).delete(`/articles/NOEXST/comments/10`).expect((res) => expect(res.body).toEqual({})));
});
