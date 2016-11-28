'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * HighValue Schema
 */
var HighValueSchema = new Schema({
  timeOfDay:Date,
  highValue:Number,
  tradeActivity:String
});

mongoose.model('HighValue', HighValueSchema);
