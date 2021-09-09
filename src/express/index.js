'use strict';

const express = require(`express`);
const path = require(`path`);

const articlesRoutes = require(`./routes/articles-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);

const { HttpCode } = require(`../constants`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const app = express();

app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use((_req, res) => res.status(HttpCode.BAD_REQUEST).render(`errors/404`));
app.use((_req, res) => res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`));

app.listen(process.env.PORT || DEFAULT_PORT, () => {
  console.log(`App listening on port ${DEFAULT_PORT}!`);
});
