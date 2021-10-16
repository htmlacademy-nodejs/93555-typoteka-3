'use strict';

const help = require(`./help`);
const fillDb = require(`./fillDb`);
const version = require(`./version`);
const server = require(`./server`);

const Cli = {
  [fillDb.name]: fillDb,
  [help.name]: help,
  [version.name]: version,
  [server.name]: server
};

module.exports = {
  Cli
};
