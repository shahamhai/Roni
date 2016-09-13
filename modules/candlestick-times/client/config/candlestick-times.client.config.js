(function () {
  'use strict';

  angular
    .module('candlestick-times')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Candlestick times',
      state: 'candlestick-times',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'candlestick-times', {
      title: 'List Candlestick times',
      state: 'candlestick-times.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'candlestick-times', {
      title: 'Create Candlestick time',
      state: 'candlestick-times.create',
      roles: ['user']
    });
  }
})();
