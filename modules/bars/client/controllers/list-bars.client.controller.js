(function () {
  'use strict';

  angular
    .module('bars')
    .controller('BarsListController', BarsListController);

  BarsListController.$inject = ['BarsService', '$scope', 'Socket'];


  function BarsListController(BarsService, $scope, Socket) {
    var vm = this,
     barsOpen = [],
     barsClose = [],
     barsHigh = [],
     barsLow = [],
     barsDates = [];

    BarsService.query(function(bars){
      //console.log(JSON.stringify(data));
      bars.forEach(function(bar) { // arrange data to draw candlestick chart
        pushBar(bar);
        //console.log('open:'+bar.openPrice+' close:'+bar.closePrice+' high:'+bar.highPrice+' low:'+bar.lowPrice+' start:'+bar.startTime);
      });
      drawChart();
    });

    Socket.on('new bar', function(bar){
      console.log(bar);
      pushBar(bar);
      drawChart();
    });

    function pushBar(bar){
      barsOpen.push(parseFloat(bar.openPrice));
      barsClose.push(parseFloat(bar.closePrice));
      barsHigh.push(parseFloat(bar.highPrice));
      barsLow.push(parseFloat(bar.lowPrice));
      barsDates.push(bar.startTime);
    }

    function drawChart(){
      var fig = PlotlyFinance.createCandlestick({
        open: barsOpen,
        high: barsHigh,
        low: barsLow,
        close: barsClose,
        dates: barsDates
      });


      $scope.data = fig.data;
      $scope.layout = fig.layout;
      $scope.options = fig.options;
      $scope.plotlyEvents = function (chart) {
        chart.on('plotly_selected', function(event){
          if (event) {
            $timeout(function() {
              $scope.NumberOfSelectedPoints = event.points.length;
            });
          }
        });
      };

      $scope.chartPlot = fig.data;



    }

  }
})();


