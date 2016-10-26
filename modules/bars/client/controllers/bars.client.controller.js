(function () {
  'use strict';

  // Bars controller
  angular
    .module('bars')
    .controller('BarsController', BarsController);

  BarsController.$inject = ['$scope', '$rootScope', '$state', 'Authentication', 'barResolve'];

  function BarsController ($scope, $rootScope, $state, Authentication, bar) {
    var vm = this;

    vm.authentication = Authentication;
    vm.bar = bar;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    $rootScope.barList = bar.find().sort('-startTime');

    // Remove existing Bar
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.bar.$remove($state.go('bars.list'));
      }
    }

    // Save Bar
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.barForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.bar._id) {
        vm.bar.$update(successCallback, errorCallback);
      } else {
        vm.bar.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('bars.view', {
          barId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
