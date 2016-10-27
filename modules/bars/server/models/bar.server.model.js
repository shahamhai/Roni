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
  aUpLine:Number,
  aLowLine:Number,
  missedHit:Number,
  stopLossOn:Number,
  sendSellAt:Number,
  sendBuyAt:Number,
  sellFilledAt:Number,
  buyFilledAt:Number,
  profitSetAt:Number,
  stopLossSetAt:Number,
  profitTakenAt:Number,
  stoplossHitAt:Number,
  profit:Number,
  accumalatedProfit:Number
});

mongoose.model('Bar', BarSchema);
