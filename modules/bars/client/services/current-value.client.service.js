(function () {
  'use strict';

  angular
    .module('bars')
    .factory('CurrentValuesService', CurrentValuesService);

  CurrentValuesService.$inject = ['$resource'];

  function CurrentValuesService($resource) {
    return $resource('/api/currentvalue/:currentValueId', {
      currentValueId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
