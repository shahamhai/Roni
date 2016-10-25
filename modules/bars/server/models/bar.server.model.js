'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Bar Schema
 */
var BarSchema = new Schema({
  startTime:Date,
  openPrice:Number,
  highPrice:Number,
  lowPrice:Number,
  closePrice:Number,
  closeTime:Date,
  AUpLine:Number,
  ALowLine:Number,
  missedHit:Number,
  stopLossOn:Number,
  sendSellAt:Number,
  sendBuyAt:Number,
  sellFilledAt:Number,
  buyFilledAt:Number,
  profitSetAt:Number,
  stopLossSet:Number,
  profitTakenAt:Number,
  stoplossHit:Number,
  profit:Number,
  accumalatedProfit:Number
});

mongoose.model('Bar', BarSchema);
