(function () {
  'use strict';

  // Candlestick times controller
  angular
    .module('candlestick-times')
    .controller('CandlestickTimesController', CandlestickTimesController);

  CandlestickTimesController.$inject = ['$scope', '$state', 'Authentication', 'candlestickTimeResolve'];

  function CandlestickTimesController ($scope, $state, Authentication, candlestickTime) {
    var vm = this;

    vm.authentication = Authentication;
    vm.candlestickTime = candlestickTime;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Candlestick time
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.candlestickTime.$remove($state.go('candlestick-times.list'));
      }
    }

    // Save Candlestick time
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.candlestickTimeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.candlestickTime._id) {
        vm.candlestickTime.$update(successCallback, errorCallback);
      } else {
        vm.candlestickTime.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('candlestick-times.view', {
          candlestickTimeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
