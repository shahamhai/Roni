'use strict';

describe('Candlestick times E2E Tests:', function () {
  describe('Test Candlestick times page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/candlestick-times');
      expect(element.all(by.repeater('candlestick-time in candlestick-times')).count()).toEqual(0);
    });
  });
});
