'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  CandlestickTime = mongoose.model('CandlestickTime'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Candlestick time
 */
exports.create = function(req, res) {
  var candlestickTime = new CandlestickTime(req.body);
  candlestickTime.user = req.user;

  candlestickTime.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(candlestickTime);
    }
  });
};

/**
 * Show the current Candlestick time
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var candlestickTime = req.candlestickTime ? req.candlestickTime.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  candlestickTime.isCurrentUserOwner = req.user && candlestickTime.user && candlestickTime.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(candlestickTime);
};

/**
 * Update a Candlestick time
 */
exports.update = function(req, res) {
  var candlestickTime = req.candlestickTime ;

  candlestickTime = _.extend(candlestickTime , req.body);

  candlestickTime.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(candlestickTime);
    }
  });
};

/**
 * Delete an Candlestick time
 */
exports.delete = function(req, res) {
  var candlestickTime = req.candlestickTime ;

  candlestickTime.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(candlestickTime);
    }
  });
};

/**
 * List of Candlestick times
 */
exports.list = function(req, res) { 
  CandlestickTime.find().sort('-created').populate('user', 'displayName').exec(function(err, candlestickTimes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(candlestickTimes);
    }
  });
};

/**
 * Candlestick time middleware
 */
exports.candlestickTimeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Candlestick time is invalid'
    });
  }

  CandlestickTime.findById(id).populate('user', 'displayName').exec(function (err, candlestickTime) {
    if (err) {
      return next(err);
    } else if (!candlestickTime) {
      return res.status(404).send({
        message: 'No Candlestick time with that identifier has been found'
      });
    }
    req.candlestickTime = candlestickTime;
    next();
  });
};
