'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
    CurrentValue = mongoose.model('CurrentValue'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Current value
 */
exports.create = function (req, res) {
    var io = req.app.get('socketio');
    var currentValue = new CurrentValue(req.body);
    
    currentValue.save(function (err) {
        if (err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.jsonp(currentValue);
            io.emit('current value update', currentValue);
            CurrentValue.find().sort({'_id':1}).limit(1).exec(function(err,previousValue){
                previousValue[0].remove(function(err){
                    if(err)
                        return res.status(400).send({
                            message: err.getErrorMessage(err)
                        });
                });
            });
        }
    });
};

/**
 * Show the current Current value
 */
exports.read = function (req, res) {

};

/**
 * Update a Current value
 */
exports.update = function (req, res) {

};

/**
 * Delete an Current value
 */
exports.delete = function (req, res) {

};

/**
 * List of Current values
 */
exports.list = function (req, res) {
    CurrentValue.find().sort({_id:1}).limit(1).exec(function(err,currentValues){
        if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(currentValues);
    }
    });
};
