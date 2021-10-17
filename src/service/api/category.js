"use strict";

const { Router } = require(`express`);

const { HttpCode } = require(`../../constants`);

module.exports = (appRouter, service) => {
  const router = new Router();

  router.get(`/`, async (_req, res) => {
    const categories = await service.findAll();

    return res.status(HttpCode.OK).json(categories);
  });

  appRouter.use(`/categories`, router);
};
