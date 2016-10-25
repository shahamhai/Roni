(function () {
  'use strict';

  describe('Bars Route Tests', function () {
    // Initialize global variables
    var $scope,
      BarsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _BarsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      BarsService = _BarsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('bars');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/bars');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          BarsController,
          mockBar;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('bars.view');
          $templateCache.put('modules/bars/client/views/view-bar.client.view.html', '');

          // create mock Bar
          mockBar = new BarsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Bar Name'
          });

          //Initialize Controller
          BarsController = $controller('BarsController as vm', {
            $scope: $scope,
            barResolve: mockBar
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:barId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.barResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            barId: 1
          })).toEqual('/bars/1');
        }));

        it('should attach an Bar to the controller scope', function () {
          expect($scope.vm.bar._id).toBe(mockBar._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/bars/client/views/view-bar.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          BarsController,
          mockBar;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('bars.create');
          $templateCache.put('modules/bars/client/views/form-bar.client.view.html', '');

          // create mock Bar
          mockBar = new BarsService();

          //Initialize Controller
          BarsController = $controller('BarsController as vm', {
            $scope: $scope,
            barResolve: mockBar
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.barResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/bars/create');
        }));

        it('should attach an Bar to the controller scope', function () {
          expect($scope.vm.bar._id).toBe(mockBar._id);
          expect($scope.vm.bar._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/bars/client/views/form-bar.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          BarsController,
          mockBar;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('bars.edit');
          $templateCache.put('modules/bars/client/views/form-bar.client.view.html', '');

          // create mock Bar
          mockBar = new BarsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Bar Name'
          });

          //Initialize Controller
          BarsController = $controller('BarsController as vm', {
            $scope: $scope,
            barResolve: mockBar
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:barId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.barResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            barId: 1
          })).toEqual('/bars/1/edit');
        }));

        it('should attach an Bar to the controller scope', function () {
          expect($scope.vm.bar._id).toBe(mockBar._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/bars/client/views/form-bar.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
