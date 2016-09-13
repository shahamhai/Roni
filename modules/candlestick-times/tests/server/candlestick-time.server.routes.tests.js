'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  CandlestickTime = mongoose.model('CandlestickTime'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, candlestickTime;

/**
 * Candlestick time routes tests
 */
describe('Candlestick time CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Candlestick time
    user.save(function () {
      candlestickTime = {
        name: 'Candlestick time name'
      };

      done();
    });
  });

  it('should be able to save a Candlestick time if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Candlestick time
        agent.post('/api/candlestickTimes')
          .send(candlestickTime)
          .expect(200)
          .end(function (candlestickTimeSaveErr, candlestickTimeSaveRes) {
            // Handle Candlestick time save error
            if (candlestickTimeSaveErr) {
              return done(candlestickTimeSaveErr);
            }

            // Get a list of Candlestick times
            agent.get('/api/candlestickTimes')
              .end(function (candlestickTimesGetErr, candlestickTimesGetRes) {
                // Handle Candlestick time save error
                if (candlestickTimesGetErr) {
                  return done(candlestickTimesGetErr);
                }

                // Get Candlestick times list
                var candlestickTimes = candlestickTimesGetRes.body;

                // Set assertions
                (candlestickTimes[0].user._id).should.equal(userId);
                (candlestickTimes[0].name).should.match('Candlestick time name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Candlestick time if not logged in', function (done) {
    agent.post('/api/candlestickTimes')
      .send(candlestickTime)
      .expect(403)
      .end(function (candlestickTimeSaveErr, candlestickTimeSaveRes) {
        // Call the assertion callback
        done(candlestickTimeSaveErr);
      });
  });

  it('should not be able to save an Candlestick time if no name is provided', function (done) {
    // Invalidate name field
    candlestickTime.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Candlestick time
        agent.post('/api/candlestickTimes')
          .send(candlestickTime)
          .expect(400)
          .end(function (candlestickTimeSaveErr, candlestickTimeSaveRes) {
            // Set message assertion
            (candlestickTimeSaveRes.body.message).should.match('Please fill Candlestick time name');

            // Handle Candlestick time save error
            done(candlestickTimeSaveErr);
          });
      });
  });

  it('should be able to update an Candlestick time if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Candlestick time
        agent.post('/api/candlestickTimes')
          .send(candlestickTime)
          .expect(200)
          .end(function (candlestickTimeSaveErr, candlestickTimeSaveRes) {
            // Handle Candlestick time save error
            if (candlestickTimeSaveErr) {
              return done(candlestickTimeSaveErr);
            }

            // Update Candlestick time name
            candlestickTime.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Candlestick time
            agent.put('/api/candlestickTimes/' + candlestickTimeSaveRes.body._id)
              .send(candlestickTime)
              .expect(200)
              .end(function (candlestickTimeUpdateErr, candlestickTimeUpdateRes) {
                // Handle Candlestick time update error
                if (candlestickTimeUpdateErr) {
                  return done(candlestickTimeUpdateErr);
                }

                // Set assertions
                (candlestickTimeUpdateRes.body._id).should.equal(candlestickTimeSaveRes.body._id);
                (candlestickTimeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Candlestick times if not signed in', function (done) {
    // Create new Candlestick time model instance
    var candlestickTimeObj = new CandlestickTime(candlestickTime);

    // Save the candlestickTime
    candlestickTimeObj.save(function () {
      // Request Candlestick times
      request(app).get('/api/candlestickTimes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Candlestick time if not signed in', function (done) {
    // Create new Candlestick time model instance
    var candlestickTimeObj = new CandlestickTime(candlestickTime);

    // Save the Candlestick time
    candlestickTimeObj.save(function () {
      request(app).get('/api/candlestickTimes/' + candlestickTimeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', candlestickTime.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Candlestick time with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/candlestickTimes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Candlestick time is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Candlestick time which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Candlestick time
    request(app).get('/api/candlestickTimes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Candlestick time with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Candlestick time if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Candlestick time
        agent.post('/api/candlestickTimes')
          .send(candlestickTime)
          .expect(200)
          .end(function (candlestickTimeSaveErr, candlestickTimeSaveRes) {
            // Handle Candlestick time save error
            if (candlestickTimeSaveErr) {
              return done(candlestickTimeSaveErr);
            }

            // Delete an existing Candlestick time
            agent.delete('/api/candlestickTimes/' + candlestickTimeSaveRes.body._id)
              .send(candlestickTime)
              .expect(200)
              .end(function (candlestickTimeDeleteErr, candlestickTimeDeleteRes) {
                // Handle candlestickTime error error
                if (candlestickTimeDeleteErr) {
                  return done(candlestickTimeDeleteErr);
                }

                // Set assertions
                (candlestickTimeDeleteRes.body._id).should.equal(candlestickTimeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Candlestick time if not signed in', function (done) {
    // Set Candlestick time user
    candlestickTime.user = user;

    // Create new Candlestick time model instance
    var candlestickTimeObj = new CandlestickTime(candlestickTime);

    // Save the Candlestick time
    candlestickTimeObj.save(function () {
      // Try deleting Candlestick time
      request(app).delete('/api/candlestickTimes/' + candlestickTimeObj._id)
        .expect(403)
        .end(function (candlestickTimeDeleteErr, candlestickTimeDeleteRes) {
          // Set message assertion
          (candlestickTimeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Candlestick time error error
          done(candlestickTimeDeleteErr);
        });

    });
  });

  it('should be able to get a single Candlestick time that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Candlestick time
          agent.post('/api/candlestickTimes')
            .send(candlestickTime)
            .expect(200)
            .end(function (candlestickTimeSaveErr, candlestickTimeSaveRes) {
              // Handle Candlestick time save error
              if (candlestickTimeSaveErr) {
                return done(candlestickTimeSaveErr);
              }

              // Set assertions on new Candlestick time
              (candlestickTimeSaveRes.body.name).should.equal(candlestickTime.name);
              should.exist(candlestickTimeSaveRes.body.user);
              should.equal(candlestickTimeSaveRes.body.user._id, orphanId);

              // force the Candlestick time to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Candlestick time
                    agent.get('/api/candlestickTimes/' + candlestickTimeSaveRes.body._id)
                      .expect(200)
                      .end(function (candlestickTimeInfoErr, candlestickTimeInfoRes) {
                        // Handle Candlestick time error
                        if (candlestickTimeInfoErr) {
                          return done(candlestickTimeInfoErr);
                        }

                        // Set assertions
                        (candlestickTimeInfoRes.body._id).should.equal(candlestickTimeSaveRes.body._id);
                        (candlestickTimeInfoRes.body.name).should.equal(candlestickTime.name);
                        should.equal(candlestickTimeInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      CandlestickTime.remove().exec(done);
    });
  });
});
