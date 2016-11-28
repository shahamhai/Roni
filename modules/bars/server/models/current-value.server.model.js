'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * CurrentValue Schema
 */
var CurrentValueSchema = new Schema({
  currentValue:Number
});

mongoose.model('CurrentValue', CurrentValueSchema);
