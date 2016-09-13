'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Candlestick times Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/candlestick-times',
      permissions: '*'
    }, {
      resources: '/api/candlestick-times/:candlestickTimeId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/candlestick-times',
      permissions: ['get', 'post']
    }, {
      resources: '/api/candlestick-times/:candlestickTimeId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/candlestick-times',
      permissions: ['get']
    }, {
      resources: '/api/candlestick-times/:candlestickTimeId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Candlestick times Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Candlestick time is being processed and the current user created it then allow any manipulation
  if (req.candlestickTime && req.user && req.candlestickTime.user && req.candlestickTime.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
