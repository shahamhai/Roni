'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  CandlestickTime = mongoose.model('CandlestickTime');

/**
 * Globals
 */
var user, candlestickTime;

/**
 * Unit tests
 */
describe('Candlestick time Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() { 
      candlestickTime = new CandlestickTime({
        name: 'Candlestick time Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return candlestickTime.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      candlestickTime.name = '';

      return candlestickTime.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    CandlestickTime.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
