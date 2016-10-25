'use strict';

describe('Bars E2E Tests:', function () {
  describe('Test Bars page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/bars');
      expect(element.all(by.repeater('bar in bars')).count()).toEqual(0);
    });
  });
});
