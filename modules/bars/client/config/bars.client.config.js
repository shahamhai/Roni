(function () {
  'use strict';

  angular
    .module('bars')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Bars',
      state: 'bars',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'bars', {
      title: 'List Bars',
      state: 'bars.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'bars', {
      title: 'Create Bar',
      state: 'bars.create',
      roles: ['user']
    });
  }
})();
