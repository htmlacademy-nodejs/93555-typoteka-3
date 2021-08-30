const { Router } = require(`express`);

const { HttpCode } = require(`../../constants`);

module.exports = (appRouter, service) => {
  const router = new Router();

  router.get(`/`, (_req, res) => {
    const categories = service.findAll();

    return res.status(HttpCode.OK).json(categories);
  });

  appRouter.use(`/categories`, router);
};
