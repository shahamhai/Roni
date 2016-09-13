(function () {
  'use strict';

  describe('Candlestick times Route Tests', function () {
    // Initialize global variables
    var $scope,
      CandlestickTimesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CandlestickTimesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CandlestickTimesService = _CandlestickTimesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('candlestick-times');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/candlestick-times');
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
          CandlestickTimesController,
          mockCandlestickTime;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('candlestick-times.view');
          $templateCache.put('modules/candlestick-times/client/views/view-candlestick-time.client.view.html', '');

          // create mock Candlestick time
          mockCandlestickTime = new CandlestickTimesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Candlestick time Name'
          });

          //Initialize Controller
          CandlestickTimesController = $controller('CandlestickTimesController as vm', {
            $scope: $scope,
            candlestickTimeResolve: mockCandlestickTime
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:candlestickTimeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.candlestickTimeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            candlestickTimeId: 1
          })).toEqual('/candlestick-times/1');
        }));

        it('should attach an Candlestick time to the controller scope', function () {
          expect($scope.vm.candlestickTime._id).toBe(mockCandlestickTime._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/candlestick-times/client/views/view-candlestick-time.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CandlestickTimesController,
          mockCandlestickTime;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('candlestick-times.create');
          $templateCache.put('modules/candlestick-times/client/views/form-candlestick-time.client.view.html', '');

          // create mock Candlestick time
          mockCandlestickTime = new CandlestickTimesService();

          //Initialize Controller
          CandlestickTimesController = $controller('CandlestickTimesController as vm', {
            $scope: $scope,
            candlestickTimeResolve: mockCandlestickTime
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.candlestickTimeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/candlestick-times/create');
        }));

        it('should attach an Candlestick time to the controller scope', function () {
          expect($scope.vm.candlestickTime._id).toBe(mockCandlestickTime._id);
          expect($scope.vm.candlestickTime._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/candlestick-times/client/views/form-candlestick-time.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CandlestickTimesController,
          mockCandlestickTime;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('candlestick-times.edit');
          $templateCache.put('modules/candlestick-times/client/views/form-candlestick-time.client.view.html', '');

          // create mock Candlestick time
          mockCandlestickTime = new CandlestickTimesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Candlestick time Name'
          });

          //Initialize Controller
          CandlestickTimesController = $controller('CandlestickTimesController as vm', {
            $scope: $scope,
            candlestickTimeResolve: mockCandlestickTime
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:candlestickTimeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.candlestickTimeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            candlestickTimeId: 1
          })).toEqual('/candlestick-times/1/edit');
        }));

        it('should attach an Candlestick time to the controller scope', function () {
          expect($scope.vm.candlestickTime._id).toBe(mockCandlestickTime._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/candlestick-times/client/views/form-candlestickTime.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
