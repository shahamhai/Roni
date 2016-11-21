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
      bars.forEach(function(bar) { // arrange data to draw candlestick chart
        pushBar(bar);
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
      //console.log('open:'+bar.openPrice+' close:'+bar.closePrice+' high:'+bar.highPrice+' low:'+bar.lowPrice+' start time:'+bar.startTime);
    }

    function drawChart(){
      var fig = PlotlyFinance.createCandlestick({
        open: barsOpen,
        high: barsHigh,
        low: barsLow,
        close: barsClose,
        dates: barsDates
      });
      console.log(JSON.stringify(fig.options));
      //
      //fig.data[0].y[3]=2166;
      fig.layout.yaxis.fixedrange=false;
      fig.layout.paper_bgcolor = '#eee';
      //
      $scope.data = fig.data;
      $scope.layout = fig.layout;
      $scope.options = {showLink: false, displayLogo: false};
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
