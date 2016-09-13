(function () {
  'use strict';

  angular
    .module('candlestick-times')
    .controller('CandlestickTimesListController', CandlestickTimesListController);

  CandlestickTimesListController.$inject = ['CandlestickTimesService'];

  function CandlestickTimesListController(CandlestickTimesService) {
    var vm = this;

    vm.candlestickTimes = CandlestickTimesService.query();
  }
})();
