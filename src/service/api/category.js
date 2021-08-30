const { Router } = require(`express`);
const { HttpCode } = require(`../../constants`);

module.exports = (app, service) => {
  const route = new Router();

  route.get(`/`, async (_req, res) => {
    const categories = await service.findAll();

    return res.status(HttpCode.OK).json(categories);
  });

  app.use(`/categories`, route);
};
