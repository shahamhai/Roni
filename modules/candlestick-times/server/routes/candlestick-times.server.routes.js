'use strict';

/**
 * Module dependencies
 */
var candlestickTimesPolicy = require('../policies/candlestick-times.server.policy'),
  candlestickTimes = require('../controllers/candlestick-times.server.controller');

module.exports = function(app) {
  // Candlestick times Routes
  app.route('/api/candlestick-times').all(candlestickTimesPolicy.isAllowed)
    .get(candlestickTimes.list)
    .post(candlestickTimes.create);

  app.route('/api/candlestick-times/:candlestickTimeId').all(candlestickTimesPolicy.isAllowed)
    .get(candlestickTimes.read)
    .put(candlestickTimes.update)
    .delete(candlestickTimes.delete);

  // Finish by binding the Candlestick time middleware
  app.param('candlestickTimeId', candlestickTimes.candlestickTimeByID);
};
