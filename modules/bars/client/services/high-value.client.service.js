(function () {
  'use strict';

  angular
    .module('bars')
    .factory('HighValuesService', HighValuesService);

  HighValuesService.$inject = ['$resource'];

  function HighValuesService($resource) {
    return $resource('/api/highvalue/:highValueId', {
      highValueId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
