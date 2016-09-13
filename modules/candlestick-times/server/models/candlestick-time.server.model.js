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
  name: {
    type: String,
    default: '',
    required: 'Please fill Candlestick time name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('CandlestickTime', CandlestickTimeSchema);
