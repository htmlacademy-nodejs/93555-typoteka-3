'use strict';

const express = require(`express`);
const request = require(`supertest`);

const comments = require(`./comments`);
const ArticleService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);

const { HttpCode } = require(`../../constants`);
const { mockArticle, mockArticles } = require(`../mocks/articles`);
const { mockComment, mockComments } = require(`../mocks/comments`);

const createAPI = () => {
  const clonedData = JSON.parse(JSON.stringify(mockArticles));

  const app = express();
  app.use(express.json());

  comments(app, new ArticleService(clonedData), new CommentService());

  return app;
};

describe(`API COMMENTS: GET`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/${mockArticle.id}/comments`);
  });

  test(`Returns 200 status code for correct request`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns correct length for comment list`, () =>
    expect(response.body.length).toBe(mockComments.length));

  test(`Return correct id for mock comment`, () =>
    expect(response.body.shift().id).toBe(mockComment.id));
});


describe(`API COMMENTS: CREATE`, () => {
  const newComment = { text: `Мне кажется или я уже читал это где-то?` };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).post(`/articles/${mockArticle.id}/comments`).send(newComment);
  });

  test(`Returns 201 status code for correct request`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));


  test(`Returns created comment`, () =>
    expect(response.body).toEqual(expect.objectContaining(newComment)));

  test(`Comments count is changed`, () =>
    request(app).get(`/articles/${mockArticle.id}/comments`).expect((res) => expect(res.body.length).toBe(mockComments.length + 1)));

  test(`Returns 404 status code for invalid article id`, () =>
    request(app).post(`/articles/NOEXST/comments`).send(newComment).expect(HttpCode.NOT_FOUND));

  test(`Returns empty object in body for invalid article id`, () =>
    request(app).post(`/articles/NOEXST/comments`).send(newComment).expect((res) => expect(res.body).toEqual({})));

  test(`Returns 400 status code for invalid request body`, () =>
    request(app).post(`/articles/${mockArticle.id}/comments`).send({}).expect(HttpCode.BAD_REQUEST))

  test(`Returns empty object in body for invalid request body`, () =>
    request(app).post(`/articles/${mockArticle.id}/comments`).send({}).expect((res) => expect(res.body).toEqual({})));
});


describe(`API COMMENTS: DELETE`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/${mockArticle.id}/comments/${mockComment.id}`);
  });

  test(`Returns 200 status code for correct request`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns correct deleted comment id`, () =>
    expect(response.body.id).toBe(mockComment.id));

  test(`Comments decreased by one`, () =>
    request(app).get(`/articles/${mockArticle.id}/comments`).expect((res) => expect(res.body.length).toBe(mockComments.length - 1))
  );

  test(`Returns 404 status code for invalid comment id`, () =>
    request(app).delete(`/articles/${mockArticle.id}/comments/NOEXST`).expect(HttpCode.NOT_FOUND));

  test(`Returns empty object in body for invalid comment id`, () =>
    request(app).delete(`/articles/${mockArticle.id}/comments/NOEXST`).expect((res) => expect(res.body).toEqual({})));

  test(`Returns 404 status code for invalid comment id`, () =>
    request(app).delete(`/articles/NOEXST/comments/${mockComment.id}`).expect(HttpCode.NOT_FOUND));

  test(`Returns empty object in body for invalid comment id`, () =>
    request(app).delete(`/articles/NOEXST/comments/${mockComment.id}`).expect((res) => expect(res.body).toEqual({})));
});
