//Bars service used to communicate Bars REST endpoints
(function () {
  'use strict';

  angular
    .module('bars')
    .factory('BarsService', BarsService);

  BarsService.$inject = ['$resource'];

  function BarsService($resource) {
    return $resource('api/bars/:barId', {
      barId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
