'use strict';

/**
 * Module dependencies
 */
var barsPolicy = require('../policies/bars.server.policy'),
  bars = require('../controllers/bars.server.controller'),
  currentValues = require('../controllers/current-value.server.controller.js'),
  highvalue = require('../controllers/high-value.server.controller.js'),
  timedEvents = require('../scripts/timed-events.js');

module.exports = function(app) {
  // Bars Routes
  app.route('/api/bars').all(barsPolicy.isAllowed)
    .get(bars.list)
    .post(timedEvents.activate, bars.create);

  app.route('/api/bars/:barId').all(barsPolicy.isAllowed)
    .get(bars.read)
    .put(bars.update)
    .delete(bars.delete);

  app.route('/api/currentvalue')
      .get(currentValues.list)
      .post(currentValues.create);

  app.route('/api/currentvalue/:currentValueId')
    .get(currentValues.read)
    .put(currentValues.update)
    .delete(currentValues.delete);

  app.route('/api/highvalue')
    .get(highvalue.list);

  // app.route('/api/highvalue/:highValueId')
  //   .get()
  //   .put()
  //   .delete();

  // Finish by binding the Bar middleware
  app.param('barId', bars.barByID);
  //app.param('currentValueId', currentValues.currentValueByID);
};
