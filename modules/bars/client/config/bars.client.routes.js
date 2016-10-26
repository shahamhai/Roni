(function () {
  'use strict';

  angular
    .module('bars')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('bars', {
        abstract: true,
        url: '/bars',
        template: '<ui-view/>'
      })
      .state('bars.list', {
        url: '',
        templateUrl: 'modules/bars/client/views/list-bars.client.view.html',
        controller: 'BarsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Bars List'
        }
      })
      .state('bars.create', {
        url: '/create',
        templateUrl: 'modules/bars/client/views/form-bar.client.view.html',
        controller: 'BarsController',
        controllerAs: 'vm',
        resolve: {
          barResolve: newBar
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Bars Create'
        }
      })
      .state('bars.edit', {
        url: '/:barId/edit',
        templateUrl: 'modules/bars/client/views/form-bar.client.view.html',
        controller: 'BarsController',
        controllerAs: 'vm',
        resolve: {
          barResolve: getBar
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Bar {{ barResolve.name }}'
        }
      })
      .state('bars.view', {
        url: '/:barId',
        templateUrl: 'modules/bars/client/views/view-bar.client.view.html',
        controller: 'BarsController',
        controllerAs: 'vm',
        resolve: {
          barResolve: getBar
        },
        data:{
          pageTitle: 'Bar {{ articleResolve.name }}'
        }
      });
  }

  getBar.$inject = ['$stateParams', 'BarsService'];

  function getBar($stateParams, BarsService) {
    return BarsService.get({
      barId: $stateParams.barId
    }).$promise;
  }

  newBar.$inject = ['BarsService'];

  function newBar(BarsService) {
    return new BarsService();
  }
})();
