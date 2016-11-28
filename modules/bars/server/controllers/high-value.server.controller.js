'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  HighValue = mongoose.model('HighValue'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a High value
 */
exports.create = function (req, res) {
	var highValue = new HighValue(req.body);
	highValue.save(function(){
		res.jsonp(highValue);
	});
};

/**
 * Show the current High value
 */
exports.read = function (req, res) {

};

/**
 * Update a High value
 */
exports.update = function (req, res) {

};

/**
 * Delete an High value
 */
exports.delete = function (req, res) {
	var highValue = req.highValue ;

  highValue.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(highValue);
    }
  });
};

/**
 * List of High values
 */
exports.list = function (req, res) {
	HighValue.find().sort('timeOfDay').exec(function(err, highValues) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(highValues);
    }
  });
};
