(function () {
  'use strict';

  angular
    .module('bars')
    .directive('test2', test2);

  test2.$inject = [/*Example: '$state', '$window' */];

  function test2(/*Example: $state, $window */) {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        // Test2 directive logic
        // ...

        element.text('this is the test2 directive');
        console.log(element);
      }
    };
  }
})();
