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
  var io = req.app.get('socketio'); // take out socket instance from the app container
  
  //var bar = new Bar(req.body);
  var bar = new Bar();
  bar.startTime         = new Date(req.body.startTime * 1000);
  bar.openPrice         = req.body.openPrice;
  bar.highPrice         = req.body.highPrice;
  bar.lowPrice          = req.body.lowPrice;
  bar.closePrice        = req.body.closePrice;
  bar.closeTime         = new Date(req.body.closeTime * 1000);
  bar.aUpLine           = req.body.aUpLine;
  bar.aLowLine          = req.body.aLowLine;
  bar.missedHit         = req.body.missedHit;
  bar.missedHitD4       = req.body.missedHitD4;
  bar.stopLossOn        = req.body.stopLossOn;
  bar.sendSellAt        = req.body.sendSellAt;
  bar.sendBuyAt         = req.body.sendBuyAt;
  bar.sellFilledAt      = req.body.sellFilledAt;
  bar.buyFilledAt       = req.body.buyFilledAt;
  bar.profitSetAt       = req.body.profitSetAt;
  bar.stopLossSetAt     = req.body.stopLossSetAt;
  bar.profitTakenAt     = req.body.profitTakenAt;
  bar.stoplossHitAt     = req.body.stoplossHitAt;
  bar.profit            = req.body.profit;
  bar.accumalatedProfit = req.body.accumalatedProfit;
  bar.contractsAmountD2 = req.body.contractsAmountD2;
  bar.contractsAmountD3 = req.body.contractsAmountD3;
  bar.contractsAmountD4 = req.body.contractsAmountD4;
  bar.profitD3          = req.body.profitD3;
  bar.profitD4          = req.body.profitD4;
  //bar.user = req.user;

  bar.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(bar);
      io.emit('new bar',bar);

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
  var today = new Date();
  today.setHours(0,0,0,0);
  Bar.find().sort('startTime').where('closeTime').gte(today).exec(function(err, bars) {
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

  Bar.findById(id).exec(function (err, bar) {
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
