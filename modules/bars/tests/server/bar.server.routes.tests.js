'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Bar = mongoose.model('Bar'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, bar;

/**
 * Bar routes tests
 */
describe('Bar CRUD tests', function () {

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

    // Save a user to the test db and create new Bar
    user.save(function () {
      bar = {
        name: 'Bar name'
      };

      done();
    });
  });

  it('should be able to save a Bar if logged in', function (done) {
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

        // Save a new Bar
        agent.post('/api/bars')
          .send(bar)
          .expect(200)
          .end(function (barSaveErr, barSaveRes) {
            // Handle Bar save error
            if (barSaveErr) {
              return done(barSaveErr);
            }

            // Get a list of Bars
            agent.get('/api/bars')
              .end(function (barsGetErr, barsGetRes) {
                // Handle Bar save error
                if (barsGetErr) {
                  return done(barsGetErr);
                }

                // Get Bars list
                var bars = barsGetRes.body;

                // Set assertions
                (bars[0].user._id).should.equal(userId);
                (bars[0].name).should.match('Bar name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Bar if not logged in', function (done) {
    agent.post('/api/bars')
      .send(bar)
      .expect(403)
      .end(function (barSaveErr, barSaveRes) {
        // Call the assertion callback
        done(barSaveErr);
      });
  });

  it('should not be able to save an Bar if no name is provided', function (done) {
    // Invalidate name field
    bar.name = '';

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

        // Save a new Bar
        agent.post('/api/bars')
          .send(bar)
          .expect(400)
          .end(function (barSaveErr, barSaveRes) {
            // Set message assertion
            (barSaveRes.body.message).should.match('Please fill Bar name');

            // Handle Bar save error
            done(barSaveErr);
          });
      });
  });

  it('should be able to update an Bar if signed in', function (done) {
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

        // Save a new Bar
        agent.post('/api/bars')
          .send(bar)
          .expect(200)
          .end(function (barSaveErr, barSaveRes) {
            // Handle Bar save error
            if (barSaveErr) {
              return done(barSaveErr);
            }

            // Update Bar name
            bar.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Bar
            agent.put('/api/bars/' + barSaveRes.body._id)
              .send(bar)
              .expect(200)
              .end(function (barUpdateErr, barUpdateRes) {
                // Handle Bar update error
                if (barUpdateErr) {
                  return done(barUpdateErr);
                }

                // Set assertions
                (barUpdateRes.body._id).should.equal(barSaveRes.body._id);
                (barUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Bars if not signed in', function (done) {
    // Create new Bar model instance
    var barObj = new Bar(bar);

    // Save the bar
    barObj.save(function () {
      // Request Bars
      request(app).get('/api/bars')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Bar if not signed in', function (done) {
    // Create new Bar model instance
    var barObj = new Bar(bar);

    // Save the Bar
    barObj.save(function () {
      request(app).get('/api/bars/' + barObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', bar.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Bar with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/bars/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Bar is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Bar which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Bar
    request(app).get('/api/bars/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Bar with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Bar if signed in', function (done) {
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

        // Save a new Bar
        agent.post('/api/bars')
          .send(bar)
          .expect(200)
          .end(function (barSaveErr, barSaveRes) {
            // Handle Bar save error
            if (barSaveErr) {
              return done(barSaveErr);
            }

            // Delete an existing Bar
            agent.delete('/api/bars/' + barSaveRes.body._id)
              .send(bar)
              .expect(200)
              .end(function (barDeleteErr, barDeleteRes) {
                // Handle bar error error
                if (barDeleteErr) {
                  return done(barDeleteErr);
                }

                // Set assertions
                (barDeleteRes.body._id).should.equal(barSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Bar if not signed in', function (done) {
    // Set Bar user
    bar.user = user;

    // Create new Bar model instance
    var barObj = new Bar(bar);

    // Save the Bar
    barObj.save(function () {
      // Try deleting Bar
      request(app).delete('/api/bars/' + barObj._id)
        .expect(403)
        .end(function (barDeleteErr, barDeleteRes) {
          // Set message assertion
          (barDeleteRes.body.message).should.match('User is not authorized');

          // Handle Bar error error
          done(barDeleteErr);
        });

    });
  });

  it('should be able to get a single Bar that has an orphaned user reference', function (done) {
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

          // Save a new Bar
          agent.post('/api/bars')
            .send(bar)
            .expect(200)
            .end(function (barSaveErr, barSaveRes) {
              // Handle Bar save error
              if (barSaveErr) {
                return done(barSaveErr);
              }

              // Set assertions on new Bar
              (barSaveRes.body.name).should.equal(bar.name);
              should.exist(barSaveRes.body.user);
              should.equal(barSaveRes.body.user._id, orphanId);

              // force the Bar to have an orphaned user reference
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

                    // Get the Bar
                    agent.get('/api/bars/' + barSaveRes.body._id)
                      .expect(200)
                      .end(function (barInfoErr, barInfoRes) {
                        // Handle Bar error
                        if (barInfoErr) {
                          return done(barInfoErr);
                        }

                        // Set assertions
                        (barInfoRes.body._id).should.equal(barSaveRes.body._id);
                        (barInfoRes.body.name).should.equal(bar.name);
                        should.equal(barInfoRes.body.user, undefined);

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
      Bar.remove().exec(done);
    });
  });
});
