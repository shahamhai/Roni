(function () {
  'use strict';

  angular
    .module('bars')
    .controller('BarsListController', BarsListController);

  BarsListController.$inject = ['BarsService'];

  function BarsListController(BarsService) {
    var vm = this;

    vm.bars = BarsService.query();
  }
})();
