'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Range Schema
 */
var RangeSchema = new Schema({
  // Range model fields
  // ...
  tickRange: Number,
  tickList: [{time: Date, open: Number, high: Number, low: Number, close: Number}]
});

mongoose.model('Range', RangeSchema);
