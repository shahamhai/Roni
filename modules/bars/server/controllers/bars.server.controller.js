'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Bar = mongoose.model('Bar'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Bar
 */
exports.create = function(req, res) {
  //var bar = new Bar(req.body);
  var bar = new Bar();
  bar.startTime = new Date(req.body.startTime * 1000);
  bar.openPrice = req.body.openPrice;
  bar.highPrice = req.body.highPrice;
  bar.lowPrice = req.body.lowPrice;
  bar.closePrice = req.body.closePrice;
  bar.closeTime = new Date(req.body.closeTime * 1000); // date
  bar.AUpLine = req.body.AUpLine;
  bar.ALowLine = req.body.ALowLine;
  bar.missedHit = req.body.missedHit;
  bar.stopLossOn = req.body.stopLossOn;
  bar.sendSellAt = req.body.sendSellAt;
  bar.sendBuyAt = req.body.sendBuyAt;
  bar.sellFilledAt = req.body.sellFilledAt;
  bar.buyFilledAt = req.body.buyFilledAt;
  bar.profitSetAt = req.body.profitSetAt;
  bar.stopLossSet = req.body.stopLossSet;
  bar.profitTakenAt = req.body.profitTakenAt;
  bar.stoplossHit = req.body.stoplossHit;
  bar.profit = req.body.profit;
  bar.accumalatedProfit = req.body.accumalatedProfit;
  //bar.user = req.user;

  bar.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(bar);
    }
  });
};

/**
 * Show the current Bar
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var bar = req.bar ? req.bar.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  //bar.isCurrentUserOwner = req.user && bar.user && bar.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(bar);
};

/**
 * Update a Bar
 */
exports.update = function(req, res) {
  var bar = req.bar ;

  bar = _.extend(bar , req.body);

  bar.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(bar);
    }
  });
};

/**
 * Delete an Bar
 */
exports.delete = function(req, res) {
  var bar = req.bar ;

  bar.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(bar);
    }
  });
};

/**
 * List of Bars
 */
exports.list = function(req, res) { 
  Bar.find().sort('-created').populate('user', 'displayName').exec(function(err, bars) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(bars);
    }
  });
};

/**
 * Bar middleware
 */
exports.barByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bar is invalid'
    });
  }

  Bar.findById(id).populate('user', 'displayName').exec(function (err, bar) {
    if (err) {
      return next(err);
    } else if (!bar) {
      return res.status(404).send({
        message: 'No Bar with that identifier has been found'
      });
    }
    req.bar = bar;
    next();
  });
};
