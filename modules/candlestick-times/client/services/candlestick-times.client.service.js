//Candlestick times service used to communicate Candlestick times REST endpoints
(function () {
  'use strict';

  angular
    .module('candlestick-times')
    .factory('CandlestickTimesService', CandlestickTimesService);

  CandlestickTimesService.$inject = ['$resource'];

  function CandlestickTimesService($resource) {
    return $resource('api/candlestick-times/:candlestickTimeId', {
      candlestickTimeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
