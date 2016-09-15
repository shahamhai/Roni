'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Candlestick time Schema
 */
var CandlestickTimeSchema = new Schema({
  StartingTime: Date,
  TimeFrame: String,
  CandlestickList: [{time: Date, open: Number, high: Number, low: Number, close: Number}]
});

mongoose.model('CandlestickTime', CandlestickTimeSchema);
