(function () {
  'use strict';

  angular
    .module('articles')
    .directive('example', example);

  example.$inject = [/*Example: '$state', '$window' */];

  function example(/*Example: $state, $window */) {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        // Example directive logic
        // ...

        element.text('this is the example directive');
      }
    };
  }
})();
