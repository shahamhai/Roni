/**
 * Created by shaham on 07-Nov-16.
 */
(function () {
    'use strict';
    angular.module('bars')
        .directive('ckchart',  ckchart);

            ckchart.$inject = [];

          function ckchart() {
            return {
                 restrict: 'E',
                scope: {
                    chartp: '=',
                    layout: '='
                },
                link: function(scope,element,attrs) {
                    scope.$watch('chartp', function(){
                        console.log('element: ' + element);
                        console.log('plots: ' + scope.chartp);
                        console.log('layout: ' + scope.layout);
                        Plotly.newPlot(element[0], scope.chartp, scope.layout);

                    });
                }
                //template: '<h1>Lorem ipsum</h1>'
            };
        }
})();
