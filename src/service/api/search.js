'use strict';

const { Router } = require(`express`);
const { HttpCode } = require(`../../constants`);

module.exports = (appRouter, service) => {
  const router = new Router();

  router.get(`/`, (req, res) => {
    const { query = `` } = req.query;

    if (!query) {
      return res.status(HttpCode.BAD_REQUEST).json([]);
    }

    const searchResults = service.findAll(query);
    const searchStatus = searchResults.length ? HttpCode.OK : HttpCode.NOT_FOUND;

    return res.status(searchStatus).json(searchResults);
  });

  appRouter.use(`/search`, router);
};
