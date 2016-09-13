(function () {
  'use strict';

  angular
    .module('candlestick-times')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('candlestick-times', {
        abstract: true,
        url: '/candlestick-times',
        template: '<ui-view/>'
      })
      .state('candlestick-times.list', {
        url: '',
        templateUrl: 'modules/candlestick-times/client/views/list-candlestick-times.client.view.html',
        controller: 'CandlestickTimesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Candlestick times List'
        }
      })
      .state('candlestick-times.create', {
        url: '/create',
        templateUrl: 'modules/candlestick-times/client/views/form-candlestick-time.client.view.html',
        controller: 'CandlestickTimesController',
        controllerAs: 'vm',
        resolve: {
          candlestick-timeResolve: newCandlestickTime
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Candlestick times Create'
        }
      })
      .state('candlestick-times.edit', {
        url: '/:candlestickTimeId/edit',
        templateUrl: 'modules/candlestick-times/client/views/form-candlestick-time.client.view.html',
        controller: 'CandlestickTimesController',
        controllerAs: 'vm',
        resolve: {
          candlestick-timeResolve: getCandlestickTime
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Candlestick time {{ candlestick-timeResolve.name }}'
        }
      })
      .state('candlestick-times.view', {
        url: '/:candlestickTimeId',
        templateUrl: 'modules/candlestick-times/client/views/view-candlestick-time.client.view.html',
        controller: 'CandlestickTimesController',
        controllerAs: 'vm',
        resolve: {
          candlestick-timeResolve: getCandlestickTime
        },
        data:{
          pageTitle: 'Candlestick time {{ articleResolve.name }}'
        }
      });
  }

  getCandlestickTime.$inject = ['$stateParams', 'CandlestickTimesService'];

  function getCandlestickTime($stateParams, CandlestickTimesService) {
    return CandlestickTimesService.get({
      candlestickTimeId: $stateParams.candlestickTimeId
    }).$promise;
  }

  newCandlestickTime.$inject = ['CandlestickTimesService'];

  function newCandlestickTime(CandlestickTimesService) {
    return new CandlestickTimesService();
  }
})();
