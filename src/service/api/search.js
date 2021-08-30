'use strict';

const { Router } = require(`express`);
const { HttpCode } = require(`../../constants`);

module.exports = (app, service) => {
  const route = new Router();

  route.get(`/`, (req, res) => {
    const { query = `` } = req.query;

    if (!query) {
      return res.status(HttpCode.BAD_REQUEST).json([]);;
    }

    const searchResults = service.findAll(query);
    const searchStatus = searchResults.length ? HttpCode.OK : HttpCode.NOT_FOUND;

    return res.status(searchStatus).json(searchResults);
  });

  app.use(`/search`, route);
};
