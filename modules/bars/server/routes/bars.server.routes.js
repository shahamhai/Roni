'use strict';

/**
 * Module dependencies
 */
var barsPolicy = require('../policies/bars.server.policy'),
  bars = require('../controllers/bars.server.controller');

module.exports = function(app) {
  // Bars Routes
  app.route('/api/bars').all(barsPolicy.isAllowed)
    .get(bars.list)
    .post(bars.create);

  app.route('/api/bars/:barId').all(barsPolicy.isAllowed)
    .get(bars.read)
    .put(bars.update)
    .delete(bars.delete);

  // Finish by binding the Bar middleware
  app.param('barId', bars.barByID);
};
