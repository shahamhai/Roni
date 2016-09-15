'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Hft Schema
 */
var HftSchema = new Schema({
  // Hft model fields
  // ...
  startTime: Date,
  targetRange: Number,
  tickList: [{time: Date, open: Number, high: Number, low: Number, close: Number}]
});

mongoose.model('Hft', HftSchema);
