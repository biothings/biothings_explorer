const { ExpressAdapter } = require('@bull-board/express')

const serverAdapter = new ExpressAdapter();

module.exports = serverAdapter;
